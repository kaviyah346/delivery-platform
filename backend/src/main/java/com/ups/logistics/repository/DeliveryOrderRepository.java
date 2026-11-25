package com.ups.logistics.repository;

import com.ups.logistics.entity.DeliveryOrder;
import com.ups.logistics.enums.OrderStatus;
import com.ups.logistics.enums.Priority;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryOrderRepository extends JpaRepository<DeliveryOrder, Long> {

    Optional<DeliveryOrder> findByOrderId(String orderId);

    boolean existsByOrderId(String orderId);

    long countByStatus(OrderStatus status);

    long countByPriority(Priority priority);

    List<DeliveryOrder> findTop10ByOrderByCreatedAtDesc();

    List<DeliveryOrder> findByAssignedVehicleId(Long vehicleId);

    List<DeliveryOrder> findByAssignedRouteId(Long routeId);

    long countByAssignedVehicleId(Long vehicleId);

    List<DeliveryOrder> findByAssignedVehicleIsNull();

    List<DeliveryOrder> findByStatus(OrderStatus status);

    @Query("SELECT o FROM DeliveryOrder o WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           " LOWER(o.orderId) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(o.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(o.customerContact) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(o.pickupAddress) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(o.destinationAddress) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:status IS NULL OR o.status = :status) AND " +
           "(:priority IS NULL OR o.priority = :priority) " +
           "ORDER BY o.createdAt DESC")
    List<DeliveryOrder> searchAndFilter(
            @Param("search") String search,
            @Param("status") OrderStatus status,
            @Param("priority") Priority priority
    );

    @Query("SELECT o FROM DeliveryOrder o WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           " LOWER(o.orderId) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(o.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(o.customerContact) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(o.pickupAddress) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(o.destinationAddress) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:status IS NULL OR o.status = :status) AND " +
           "(:priority IS NULL OR o.priority = :priority)")
    Page<DeliveryOrder> searchAndFilterPaged(
            @Param("search") String search,
            @Param("status") OrderStatus status,
            @Param("priority") Priority priority,
            Pageable pageable
    );

    @Query("SELECT COALESCE(SUM(o.packageWeight), 0.0) FROM DeliveryOrder o WHERE o.assignedVehicle.id = :vehicleId AND o.status != 'DELIVERED'")
    Double calculateCurrentVehicleLoad(@Param("vehicleId") Long vehicleId);

    @Query("SELECT COALESCE(SUM(o.packageWeight), 0.0) FROM DeliveryOrder o WHERE o.status = 'DELIVERED'")
    Double sumTotalDeliveredWeight();
}
