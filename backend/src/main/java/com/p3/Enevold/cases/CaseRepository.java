package com.p3.Enevold.cases;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface CaseRepository extends MongoRepository<Case, String> {
}
