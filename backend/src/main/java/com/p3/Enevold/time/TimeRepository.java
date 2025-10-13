package com.p3.Enevold.time;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface TimeRepository extends MongoRepository<Time, String> {
    Optional<Time> findById(String id);
}
