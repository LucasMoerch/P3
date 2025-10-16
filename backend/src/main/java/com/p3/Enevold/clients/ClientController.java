package com.p3.Enevold.clients;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
public class ClientController {
@Autowired
    ClientRepository clientRepository;
    @PostMapping ("/addClient")
    public void addClient (@RequestBody Client client) {
        clientRepository.save(client);
    }
    @GetMapping ("/fetchClients")
    public List<Client> fetchClients () {
        return clientRepository.findAll();
    }

    @GetMapping ("/getClients/{id}")
    public Client getClient (@PathVariable String id) {
      return  clientRepository.findById(id).orElse(null);
    }

    @PutMapping("/updateClient/{id}")
    public Client updateClient(@PathVariable String id, @RequestBody Client client) {
        return clientRepository.findById(id).map(data -> {
            if (client.getName() != null) data.setName(client.getName());
            if (client.getContactEmail() != null) data.setContactEmail(client.getContactEmail());
            if (client.getContactPhone() != null) data.setContactPhone(client.getContactPhone());
            if (client.getNotes() != null) data.setNotes(client.getNotes());
            if (client.getCreatedAt() != null) data.setCreatedAt(client.getCreatedAt());
            return clientRepository.save(data);
        }).orElse(null);
    }

    @DeleteMapping("/deleteClient/{id}")
    public void deleteClient(@PathVariable String id) {
        clientRepository.deleteById(id);
    }

}


