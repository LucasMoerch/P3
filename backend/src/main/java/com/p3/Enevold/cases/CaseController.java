package com.p3.Enevold.cases;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.bson.types.ObjectId;

import java.time.Instant;
import java.util.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.io.IOException;
import java.util.Date;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import com.p3.Enevold.utils.FileDocument;

@RestController
@RequestMapping("/cases")
public class CaseController {

  @Autowired
  private CaseRepository repo;

  @PostMapping("/create")
  public ResponseEntity<?> createCase(@RequestParam String title,
      @RequestParam String description,
      @RequestParam String status) {
    try {
      List<String> allowedStatuses = List.of("OPEN", "ON_HOLD", "CLOSED");
      String normalizedStatus = status.toUpperCase();

      if (!allowedStatuses.contains(normalizedStatus)) {
        return ResponseEntity.badRequest().body(Map.of(
            "error", "InvalidStatus",
            "message", "Status must be one of: OPEN, ON_HOLD, CLOSED"));
      }

      Case c = new Case();

      c.setcaseId(new ObjectId("652bc56efba9ab8ef7ab9a91")); // temporary dummy case

      c.setTitle(title);
      c.setDescription(description);
      c.setStatus(normalizedStatus);
      c.setAssignedUserIds(new ArrayList<>());
      c.setDocuments(new java.util.ArrayList<>());

      Date now = Date.from(Instant.now());
      c.setUpdatedAt(now);

      Case saved = repo.save(c);
      return ResponseEntity.ok(saved);

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.badRequest().body(Map.of(
          "error", e.getClass().getSimpleName(),
          "message", e.getMessage()));
    }
  }

  // Upload a file/document to a specific case
  @PostMapping("/{caseId}/uploadDocument")
  public ResponseEntity<String> uploadDocument(
      @PathVariable String caseId,
      @RequestParam("file") MultipartFile file,
      @RequestParam(value = "createdBy", required = false) String createdBy) {

    try {
      // Find the case
      case case = caseRepository.findById(caseId).orElse(null);
      if (case == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body("case not found");
      }

      // Create a new FileDocument
      FileDocument document = new FileDocument();
      document.setFileName(file.getOriginalFilename());
      document.setContentType(file.getContentType());
      document.setData(file.getBytes());
      document.setUploadedAt(new Date());
      document.setCreatedBy(createdBy != null ? createdBy : "Unknown");

      // Add to case's documents list (init if null)
      if (case.getDocuments() == null)
        case.setDocuments(new java.util.ArrayList<>());
        case.getDocuments().add(document);

        // Save the case
        caseRepository.save(case);

      return ResponseEntity.ok("File uploaded successfully: " + file.getOriginalFilename());
    } catch (IOException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Failed to upload file: " + e.getMessage());
    }
  }

  // Get all documents for a specific case
  @GetMapping("/{caseId}/documents")
  public ResponseEntity<List<FileDocument>> getFileDocuments(@PathVariable String caseId) {
    case case = caseRepository.findById(caseId).orElse(null);
    if (case == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
    return ResponseEntity.ok(case.getDocuments());
  }

  // Download a specific document
  @GetMapping("/{caseId}/documents/{documentIndex}/download")
  public ResponseEntity<byte[]> downloadDocument(
      @PathVariable String caseId,
      @PathVariable int documentIndex) {

    case case = caseRepository.findById(caseId).orElse(null);
    if (case == null || case.getDocuments() == null
      || documentIndex >= case.getDocuments().size()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    FileDocument document = case.getDocuments().get(documentIndex);

    return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType(document.getContentType()))
        .header(HttpHeaders.CONTENT_DISPOSITION,
            "attachment; filename=\"" + document.getFileName() + "\"")
        .body(document.getData());
  }

  // Delete a specific document
  @DeleteMapping("/{caseId}/documents/{documentIndex}")
  public ResponseEntity<String> deleteDocument(
      @PathVariable String caseId,
      @PathVariable int documentIndex) {

    Case case = caseRepository.findById(caseId).orElse(null);
    if (case == null || case.getDocuments() == null
        || documentIndex >= case.getDocuments().size()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body("case or document not found");
    }

    case.getDocuments().remove(documentIndex);
    caseRepository.save(case);

    return ResponseEntity.ok("Document deleted successfully");
  }

  @GetMapping
  public ResponseEntity<List<Case>> getAllCases() {
    return ResponseEntity.ok(repo.findAll());
  }
}
