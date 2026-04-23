package com.sliit.smartcampus.service;

import com.sliit.smartcampus.exception.ResourceNotFoundException;
import com.sliit.smartcampus.model.Resource;
import com.sliit.smartcampus.model.Resource.ResourceType;
import com.sliit.smartcampus.model.Resource.ResourceStatus;
import com.sliit.smartcampus.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.time.LocalTime;
import com.sliit.smartcampus.repository.BookingRepository;
import com.sliit.smartcampus.model.Booking.BookingStatus;
import com.sliit.smartcampus.exception.ConflictException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final BookingRepository bookingRepository;
    private final FileStorageService fileStorageService;

    public List<Resource> searchResources(ResourceType type, ResourceStatus status,
                                          String location, Integer minCapacity, String search) {
        return resourceRepository.searchResources(type, status, location, minCapacity, search);
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Resource getById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + id));
    }

    public Resource createResource(Resource resource) {
        // Validation
        if (resource.getName() == null || resource.getName().isBlank()) {
            throw new IllegalArgumentException("Resource name cannot be empty");
        }
        if (resource.getCapacity() != null && resource.getCapacity() <= 0) {
            throw new IllegalArgumentException("Capacity must be positive");
        }
        // availability time validation if provided (format HH:mm)
        if (resource.getAvailabilityStart() != null && resource.getAvailabilityEnd() != null) {
            LocalTime start = LocalTime.parse(resource.getAvailabilityStart());
            LocalTime end = LocalTime.parse(resource.getAvailabilityEnd());
            if (!end.isAfter(start)) {
                throw new IllegalArgumentException("Availability end time must be after start time");
            }
        }
        // duplicate check
        Optional<Resource> existing = resourceRepository.findByNameAndLocation(resource.getName(), resource.getLocation());
        if (existing.isPresent()) {
            throw new ConflictException("Resource with same name and location already exists");
        }
        return resourceRepository.save(resource);
    }

    public Resource updateResource(Long id, Resource updated) {
        Resource existing = getById(id);
        existing.setName(updated.getName());
        existing.setType(updated.getType());
        existing.setCapacity(updated.getCapacity());
        existing.setLocation(updated.getLocation());
        existing.setDescription(updated.getDescription());
        existing.setAvailabilityStart(updated.getAvailabilityStart());
        existing.setAvailabilityEnd(updated.getAvailabilityEnd());
        existing.setStatus(updated.getStatus());
        return resourceRepository.save(existing);
    }

    public void deleteResource(Long id) {
        Resource resource = getById(id);
        // Prevent deletion if there are pending/approved bookings
        List<com.sliit.smartcampus.model.Booking> active = bookingRepository.findByResourceIdAndStatus(id, BookingStatus.APPROVED);
        if (!active.isEmpty()) {
            throw new ConflictException("Cannot delete resource with active approved bookings");
        }
        resourceRepository.delete(resource);
    }

    public Resource addImage(Long id, org.springframework.web.multipart.MultipartFile file) {
        Resource resource = getById(id);
        if (resource.getImages().size() >= 5) {
            throw new ConflictException("Maximum 5 images allowed per resource.");
        }
        
        // Basic validation
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed.");
        }
        
        String fileUrl = fileStorageService.storeFile(file);
        resource.getImages().add(fileUrl);
        return resourceRepository.save(resource);
    }

    public Resource removeImage(Long id, String imageUrl) {
        Resource resource = getById(id);
        if (resource.getImages().remove(imageUrl)) {
            fileStorageService.deleteFile(imageUrl);
            return resourceRepository.save(resource);
        }
        throw new ResourceNotFoundException("Image URL not found for this resource");
    }
}