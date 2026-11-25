package com.ups.logistics.repository;

import com.ups.logistics.entity.Vehicle;
import com.ups.logistics.enums.VehicleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Optional<Vehicle> findByVehicleNumber(String vehicleNumber);

    boolean existsByVehicleNumber(String vehicleNumber);

    long countByStatus(VehicleStatus status);

    List<Vehicle> findByStatus(VehicleStatus status);

    @Query("SELECT COALESCE(SUM(v.maxCapacityKg), 0.0) FROM Vehicle v")
    Double sumTotalMaxCapacity();

    @Query("SELECT COALESCE(SUM(v.currentLoadKg), 0.0) FROM Vehicle v")
    Double sumTotalCurrentLoad();
}
