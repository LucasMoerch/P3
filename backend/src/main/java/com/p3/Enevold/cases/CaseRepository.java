package com.p3.Enevold.cases;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CaseRepository extends MongoRepository<Case, String> {
}
