package com.sliit.smartcampus.config;

import com.sliit.smartcampus.model.*;
import com.sliit.smartcampus.model.Resource.ResourceStatus;
import com.sliit.smartcampus.model.Resource.ResourceType;
import com.sliit.smartcampus.model.Ticket.Priority;
import com.sliit.smartcampus.model.Ticket.TicketStatus;
import com.sliit.smartcampus.model.User.Role;
import com.sliit.smartcampus.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

        private final UserRepository userRepository;
        private final ResourceRepository resourceRepository;
        private final BookingRepository bookingRepository;
        private final TicketRepository ticketRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) {
                if (userRepository.count() > 0) {
                        return;
                }

                log.info("Seeding database with demo data...");

                // Create Users
                String encodedPassword = passwordEncoder.encode("password");

                User admin = User.builder().name("Admin User").email("admin@admincampus.edu")
                                .password(encodedPassword).role(Role.ADMIN).build();
                User student = User.builder().name("Alex Johnson").email("it23367258@my.sliit.lk")
                                .password(passwordEncoder.encode("Dish@123")).role(Role.USER).build();
                User technician = User.builder().name("Sam Perera").email("tech@techcampus.edu")
                                .password(encodedPassword).role(Role.TECHNICIAN).build();
                User ops = User.builder().name("Operations Manager").email("ops@opscampus.edu")
                                .password(encodedPassword).role(Role.OPERATIONS).build();
                User staff = User.builder().name("Staff Member").email("staff@sliit.lk")
                                .password(encodedPassword).role(Role.STAFF).build();

                admin = userRepository.save(admin);
                student = userRepository.save(student);
                technician = userRepository.save(technician);
                ops = userRepository.save(ops);
                staff = userRepository.save(staff);

                // Create Resources
                Resource lecHallA = Resource.builder()
                                .name("Lecture Hall A").type(ResourceType.ROOM).capacity(200)
                                .location("Building 1, Floor 1")
                                .description("Main lecture hall with projector and PA system")
                                .availabilityStart("08:00").availabilityEnd("21:00").status(ResourceStatus.ACTIVE)
                                .build();

                Resource labCS01 = Resource.builder()
                                .name("CS Lab 01").type(ResourceType.LAB).capacity(40)
                                .location("Building 2, Floor 2")
                                .description("Computer Science lab with 40 workstations")
                                .availabilityStart("08:00").availabilityEnd("20:00").status(ResourceStatus.ACTIVE)
                                .build();

                Resource meetingRoomB = Resource.builder()
                                .name("Meeting Room B").type(ResourceType.ROOM).capacity(20)
                                .location("Building 3, Floor 1")
                                .description("Conference room with whiteboard and video conferencing")
                                .availabilityStart("09:00").availabilityEnd("18:00").status(ResourceStatus.ACTIVE)
                                .build();

                Resource projector01 = Resource.builder()
                                .name("Projector Unit 01").type(ResourceType.EQUIPMENT).capacity(1)
                                .location("Equipment Store, Building 1").description("4K portable projector")
                                .availabilityStart("08:00").availabilityEnd("20:00").status(ResourceStatus.ACTIVE)
                                .build();

                Resource physicLab = Resource.builder()
                                .name("Physics Laboratory").type(ResourceType.LAB).capacity(30)
                                .location("Building 4, Floor 1")
                                .description("Physics lab with advanced measurement equipment")
                                .availabilityStart("08:00").availabilityEnd("17:00").status(ResourceStatus.ACTIVE)
                                .build();

                Resource seminarRoom = Resource.builder()
                                .name("Seminar Room C").type(ResourceType.ROOM).capacity(50)
                                .location("Building 1, Floor 3").description("Seminar room with tiered seating")
                                .availabilityStart("08:00").availabilityEnd("21:00")
                                .status(ResourceStatus.OUT_OF_SERVICE).build();

                lecHallA = resourceRepository.save(lecHallA);
                labCS01 = resourceRepository.save(labCS01);
                meetingRoomB = resourceRepository.save(meetingRoomB);
                projector01 = resourceRepository.save(projector01);
                physicLab = resourceRepository.save(physicLab);
                seminarRoom = resourceRepository.save(seminarRoom);

                // Create sample bookings
                Booking booking1 = Booking.builder()
                                .resource(lecHallA).user(student)
                                .date(LocalDate.now().plusDays(2))
                                .startTime(LocalTime.of(9, 0)).endTime(LocalTime.of(11, 0))
                                .purpose("Data Structures Revision Session")
                                .status(Booking.BookingStatus.PENDING).build();

                Booking booking2 = Booking.builder()
                                .resource(labCS01).user(student)
                                .date(LocalDate.now().plusDays(1))
                                .startTime(LocalTime.of(14, 0)).endTime(LocalTime.of(16, 0))
                                .purpose("Group Project Development").status(Booking.BookingStatus.APPROVED).build();

                Booking booking3 = Booking.builder()
                                .resource(meetingRoomB).user(admin)
                                .date(LocalDate.now().plusDays(3))
                                .startTime(LocalTime.of(10, 0)).endTime(LocalTime.of(12, 0))
                                .purpose("Faculty Meeting").status(Booking.BookingStatus.APPROVED).build();

                bookingRepository.save(booking1);
                bookingRepository.save(booking2);
                bookingRepository.save(booking3);

                // Create sample tickets
                Ticket ticket1 = Ticket.builder()
                                .title("Projector not working in Lecture Hall A")
                                .resourceOrLocation("Lecture Hall A, Building 1, Floor 1")
                                .category("Equipment Failure")
                                .description("The main projector in Lecture Hall A is not displaying any image. Tried restarting but the issue persists.")
                                .priority(Priority.HIGH).status(TicketStatus.IN_PROGRESS)
                                .reporter(student).assignedTechnician(technician)
                                .build();

                Ticket ticket2 = Ticket.builder()
                                .title("Air conditioning unit faulty in CS Lab 01")
                                .resourceOrLocation("CS Lab 01, Building 2").category("Facility Issue")
                                .description("The AC unit is making loud noise and not cooling properly. Students are unable to work comfortably.")
                                .priority(Priority.MEDIUM).status(TicketStatus.OPEN)
                                .reporter(student).build();

                Ticket ticket3 = Ticket.builder()
                                .title("Network switch down in Building 3")
                                .resourceOrLocation("Building 3, Server Room").category("Network Issue")
                                .description("Network switch in server room is unresponsive. All rooms on Floor 2 of Building 3 have no network access.")
                                .priority(Priority.CRITICAL).status(TicketStatus.RESOLVED)
                                .reporter(admin).assignedTechnician(technician)
                                .resolutionNotes("Switch was replaced with a spare unit. Network access restored.")
                                .build();

                ticketRepository.save(ticket1);
                ticketRepository.save(ticket2);
                ticketRepository.save(ticket3);

                log.info("Demo data seeded successfully.");
                log.info("Login: admin@admincampus.edu / it23367258@my.sliit.lk(Dish@123) / tech@techcampus.edu / ops@opscampus.edu / staff@sliit.lk (password: password)");
        }
}