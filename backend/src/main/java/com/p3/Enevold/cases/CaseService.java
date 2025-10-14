package com.p3.Enevold.cases;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CaseService {

    @Autowired
    private CaseRepository caseRepository;

    public List<Case> getAllCases() {
        return caseRepository.findAll();
    }

    public Case createCase(Case newCase) {
        newCase.setCreatedAt(new Date());
        newCase.setUpdatedAt(new Date());
        return caseRepository.save(newCase);
    }

    public Optional<Case> updateCase(String id, Case updatedData) {
        return caseRepository.findById(id).map(existing -> {
            existing.setTitle(updatedData.getTitle());
            existing.setDescription(updatedData.getDescription());
            existing.setStatus(updatedData.getStatus());
            existing.setClientId(updatedData.getClientId());
            existing.setAssignedUserIds(updatedData.getAssignedUserIds());
            existing.setUpdatedAt(new Date());
            return caseRepository.save(existing);
        });
    }
}
