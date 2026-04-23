package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.model.Resource;
import com.sliit.smartcampus.model.Resource.ResourceType;
import com.sliit.smartcampus.model.Resource.ResourceStatus;
import com.sliit.smartcampus.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @GetMapping
    public ResponseEntity<List<Resource>> getResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) String search) {

        ResourceType typeEnum = type != null ? ResourceType.valueOf(type.toUpperCase()) : null;
        ResourceStatus statusEnum = status != null ? ResourceStatus.valueOf(status.toUpperCase()) : null;
        return ResponseEntity.ok(resourceService.searchResources(typeEnum, statusEnum, location, minCapacity, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResource(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> createResource(@RequestBody Resource resource) {
        return ResponseEntity.status(HttpStatus.CREATED).body(resourceService.createResource(resource));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> updateResource(@PathVariable Long id, @RequestBody Resource resource) {
        return ResponseEntity.ok(resourceService.updateResource(id, resource));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/images")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> uploadImage(@PathVariable Long id, @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        return ResponseEntity.ok(resourceService.addImage(id, file));
    }

    @DeleteMapping("/{id}/images")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> deleteImage(@PathVariable Long id, @RequestParam("imageUrl") String imageUrl) {
        return ResponseEntity.ok(resourceService.removeImage(id, imageUrl));
    }
}