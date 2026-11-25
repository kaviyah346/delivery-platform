import React, { useState, useEffect } from 'react';
import { orderApi } from '../api/orderApi';
import OrderFilters from '../components/orders/OrderFilters';
import OrderTable from '../components/orders/OrderTable';
import OrderFormModal from '../components/orders/OrderFormModal';
import OrderDetailsModal from '../components/orders/OrderDetailsModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { Plus, RefreshCw, PackagePlus, AlertCircle } from 'lucide-react';

export default function OrdersPage({ showToast, onDataChange }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await orderApi.getAllOrders({
        search,
        status: statusFilter,
        priority: priorityFilter,
      });
      if (res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch delivery orders');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search / filter trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter, priorityFilter]);

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
  };

  // Form submit (Create or Update)
  const handleFormSubmit = async (formData) => {
    try {
      setFormSubmitting(true);
      setServerErrors(null);

      if (selectedOrder) {
        // Update
        const res = await orderApi.updateOrder(selectedOrder.id, formData);
        showToast({
          type: 'success',
          title: 'Order Updated',
          message: `Delivery order ${res.data.orderId} updated successfully.`,
        });
      } else {
        // Create
        const res = await orderApi.createOrder(formData);
        showToast({
          type: 'success',
          title: 'Order Created',
          message: `Delivery order ${res.data.orderId} registered in PostgreSQL.`,
        });
      }

      setIsFormOpen(false);
      setSelectedOrder(null);
      fetchOrders();
      if (onDataChange) onDataChange();
    } catch (err) {
      if (err.validationErrors) {
        setServerErrors(err.validationErrors);
      }
      showToast({
        type: 'error',
        title: selectedOrder ? 'Update Failed' : 'Creation Failed',
        message: err.message,
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Order
  const handleDeleteConfirm = async () => {
    if (!selectedOrder) return;
    try {
      setDeleteSubmitting(true);
      await orderApi.deleteOrder(selectedOrder.id);
      showToast({
        type: 'success',
        title: 'Order Deleted',
        message: `Order ${selectedOrder.orderId} deleted from database.`,
      });
      setIsDeleteOpen(false);
      setSelectedOrder(null);
      fetchOrders();
      if (onDataChange) onDataChange();
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message,
      });
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setSelectedOrder(null);
    setServerErrors(null);
    setIsFormOpen(true);
  };

  const openEditModal = (order) => {
    setSelectedOrder(order);
    setServerErrors(null);
    setIsFormOpen(true);
  };

  const openViewModal = (order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const openDeleteModal = (order) => {
    setSelectedOrder(order);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-ups-gray-border shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-ups-brown flex items-center gap-2">
            Delivery Order Management
          </h2>
          <p className="text-xs text-ups-text-muted mt-0.5">
            Create, track, filter, and allocate customer shipments across the delivery network.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchOrders}
            disabled={loading}
            className="p-2 text-ups-text-muted hover:text-ups-brown rounded-lg border border-ups-gray-border hover:bg-ups-gray-bg transition-colors"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-ups-gold' : ''}`} />
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-ups-gold hover:bg-ups-gold-hover text-ups-brown font-bold text-xs sm:text-sm shadow-sm transition-all duration-150 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Delivery Order</span>
          </button>
        </div>
      </div>

      {/* Error alert if any */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchOrders}
            className="font-bold underline hover:no-underline text-rose-900"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <OrderFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        onReset={handleResetFilters}
        totalResults={orders.length}
      />

      {/* Order List Table */}
      {loading && orders.length === 0 ? (
        <LoadingSpinner message="Fetching delivery orders from PostgreSQL..." />
      ) : orders.length > 0 ? (
        <OrderTable
          orders={orders}
          onView={openViewModal}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />
      ) : (
        <EmptyState
          title="No delivery orders found"
          description={
            search || statusFilter !== 'ALL' || priorityFilter !== 'ALL'
              ? 'No orders matched your current search and filter criteria.'
              : 'There are currently no orders in the database. Add your first delivery order to begin.'
          }
          onAction={openCreateModal}
          actionText="Create New Order"
        />
      )}

      {/* Create / Edit Modal */}
      <OrderFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedOrder(null);
        }}
        onSubmit={handleFormSubmit}
        order={selectedOrder}
        isSubmitting={formSubmitting}
        serverErrors={serverErrors}
      />

      {/* Details Modal */}
      <OrderDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onEdit={(ord) => {
          openEditModal(ord);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedOrder(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Confirm Order Deletion"
        message={`Are you sure you want to permanently delete delivery order ${selectedOrder?.orderId ? selectedOrder.orderId.replace(/^UPS-/, '') : ''} for customer "${selectedOrder?.customerName}"? This action will remove the record from PostgreSQL.`}
        confirmText="Permanently Delete"
        confirmLoading={deleteSubmitting}
        danger={true}
      />
    </div>
  );
}
