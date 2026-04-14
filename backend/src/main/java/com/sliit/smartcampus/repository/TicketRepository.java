package com.sliit.smartcampus.repository;

import com.sliit.smartcampus.model.Ticket;
import com.sliit.smartcampus.model.Ticket.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByReporterIdOrderByCreatedAtDesc(Long reporterId);

    List<Ticket> findByAssignedTechnicianIdOrderByCreatedAtDesc(Long technicianId);

    List<Ticket> findAllByOrderByCreatedAtDesc();

    List<Ticket> findByStatus(TicketStatus status);
}
