package com.p3.Enevold.users;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.p3.Enevold.users.Time; // adjust if Time is elsewhere

public interface TimeRepository extends MongoRepository<Time, String> {
    Optional<Time> findById(String id);
}
