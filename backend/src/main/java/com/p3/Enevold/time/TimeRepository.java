package com.p3.Enevold.time;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface TimeRepository extends MongoRepository<Time, String> {
    Optional<Time> findByStartTime(String startTime);

    Optional<Time> findFirstByUserIdOrderByStartTimeDesc(String userId);
    Optional<Time> findTopByUserIdOrderByStartTimeDesc(String userId);
}
