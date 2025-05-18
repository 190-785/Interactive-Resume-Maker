package com.resumeforest.payload.response;

import java.util.HashMap;
import java.util.Map;

public class MessageResponse {
    private String message;
    private Map<String, Object> data;

    public MessageResponse(String message) {
        this.message = message;
        this.data = new HashMap<>();
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
    
    public Map<String, Object> getData() {
        return data;
    }
    
    public void setData(Map<String, Object> data) {
        this.data = data;
    }
    
    public MessageResponse addData(String key, Object value) {
        this.data.put(key, value);
        return this;
    }
}
