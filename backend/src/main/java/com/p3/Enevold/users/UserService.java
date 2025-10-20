package com.p3.Enevold.users;

import com.p3.Enevold.users.User;
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

    // Performs an Upsert using the nested 'auth.email' field for the query.
    public User inviteOrUpdateUser(String email, String role) {

        Query query = new Query(Criteria.where("auth.email").is(email));
        Update update = new Update()

                // Set root fields
                .set("roles", List.of(role))
                .set("status", "invited")

                // Set nested Auth fields
                .set("auth.provider", "google")
                .set("auth.sub", null)
                .set("auth.email", email)
                .set("auth.emailVerified", false)
                .set("auth.pictureUrl", null)

                // Set nested Profile fields
                .set("profile", null)
                .set("staff", null)

                // Set Audit fields to manage creation
                .setOnInsert("audit.createdAt", Instant.now())
                .set("audit.updatedAt", Instant.now())
                .setOnInsert("audit.createdBy", "SYSTEM/ADMIN");

        // Execute the upsert operation
        mongoTemplate.upsert(query, update, User.class);

        // Retrieve and return the resulting User document
        return mongoTemplate.findOne(query, User.class);
    }
}