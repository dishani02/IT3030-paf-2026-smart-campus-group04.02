package com.sliit.smartcampus.repository;

import com.sliit.smartcampus.model.Resource;
import com.sliit.smartcampus.model.Resource.ResourceType;
import com.sliit.smartcampus.model.Resource.ResourceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    List<Resource> findByType(ResourceType type);

    List<Resource> findByStatus(ResourceStatus status);

    List<Resource> findByTypeAndStatus(ResourceType type, ResourceStatus status);

    @Query("SELECT r FROM Resource r WHERE " +
           "(:type IS NULL OR r.type = :type) AND " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:location IS NULL OR LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:minCapacity IS NULL OR r.capacity >= :minCapacity) AND " +
           "(:search IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Resource> searchResources(
            @Param("type") ResourceType type,
            @Param("status") ResourceStatus status,
            @Param("location") String location,
            @Param("minCapacity") Integer minCapacity,
            @Param("search") String search
    );

    java.util.Optional<Resource> findByNameAndLocation(String name, String location);
}
