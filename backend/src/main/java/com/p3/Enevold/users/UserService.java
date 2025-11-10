package com.p3.Enevold.users;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class UserService {

    private final MongoTemplate mongoTemplate;

    public UserService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public User inviteOrUpdateUser(String email, List<String> roles) {

        Query query = new Query(Criteria.where("auth.email").is(email));

        Update update = new Update()

                .addToSet("roles").each(roles.toArray())

                .setOnInsert("status", "invited")

                .setOnInsert("auth.provider", "google")
                .setOnInsert("auth.sub", null)
                .setOnInsert("auth.email", email)
                .setOnInsert("auth.emailVerified", false)
                .setOnInsert("auth.pictureUrl", null)

                .setOnInsert("profile", null)
                .setOnInsert("staff", null)

                .setOnInsert("audit.createdAt", Instant.now())
                .setOnInsert("audit.createdBy", "SYSTEM/ADMIN")
                .set("audit.updatedAt", Instant.now());

        mongoTemplate.upsert(query, update, User.class);

        return mongoTemplate.findOne(query, User.class);
    }
}