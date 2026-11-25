package com.ups.logistics.repository;

import com.ups.logistics.entity.DeliveryRoute;
import com.ups.logistics.enums.RouteStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRouteRepository extends JpaRepository<DeliveryRoute, Long> {

    Optional<DeliveryRoute> findByRouteCode(String routeCode);

    boolean existsByRouteCode(String routeCode);

    long countByStatus(RouteStatus status);

    List<DeliveryRoute> findByStatus(RouteStatus status);

    List<DeliveryRoute> findByVehicleId(Long vehicleId);
}
