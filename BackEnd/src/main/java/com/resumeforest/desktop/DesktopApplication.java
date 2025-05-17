package com.resumeforest.desktop;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;
import org.json.JSONObject;

/**
 * Desktop app                 // Create HTTP request
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_BASE_URL + "/auth/v1/login"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json.toString()))
                    .build(); // Create HTTP request
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_BASE_URL + "/auth/v1/login"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json.toString()))
                    .build();on for Resume Forest
 * Provides authentication and basic resume management functionality
 */
public class DesktopApplication extends JFrame {

    private static final String API_BASE_URL = "http://localhost:8080/api";
    private static final int WIDTH = 900;
    private static final int HEIGHT = 600;

    private String authToken = null;
    private String currentUserId = null;

    private JTabbedPane tabbedPane;
    private JPanel loginPanel;
    private JPanel registerPanel;
    private JPanel dashboardPanel;
    private JPanel resumeEditorPanel; // This variable is declared but not used. Consider removing if not needed.

    private HttpClient httpClient;

    public DesktopApplication() {
        super("Resume Forest - Interactive 3D Resume Creator");

        // Initialize HTTP client
        httpClient = HttpClient.newHttpClient();

        // Configure window
        setSize(WIDTH, HEIGHT);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        // Initialize UI components
        initComponents();

        // Show window
        setVisible(true);
    }

    private void initComponents() {
        // Create main tabbed pane
        tabbedPane = new JTabbedPane();

        // Initialize panels
        createLoginPanel();
        createRegisterPanel();

        // Add panels to tabbed pane
        tabbedPane.addTab("Login", loginPanel);
        tabbedPane.addTab("Register", registerPanel);

        // Add tabbed pane to frame
        add(tabbedPane);
    }

    private void createLoginPanel() {
        loginPanel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);

        // Create components
        JLabel titleLabel = new JLabel("Resume Forest - Login");
        titleLabel.setFont(new Font("Arial", Font.BOLD, 24));

        JLabel usernameLabel = new JLabel("Username:");
        JTextField usernameField = new JTextField(20);

        JLabel passwordLabel = new JLabel("Password:");
        JPasswordField passwordField = new JPasswordField(20);

        JButton loginButton = new JButton("Login");
        JButton demoButton = new JButton("View Demo Resume");
        JLabel statusLabel = new JLabel("");
        statusLabel.setForeground(Color.RED);

        // Add action listener to login button
        loginButton.addActionListener(e -> {
            String username = usernameField.getText();
            String password = new String(passwordField.getPassword());

            if (username.isEmpty() || password.isEmpty()) {
                statusLabel.setText("Please enter both username and password");
                return;
            }

            try {
                login(username, password, statusLabel);
            } catch (Exception ex) {
                statusLabel.setText("Login error: " + ex.getMessage());
                ex.printStackTrace();
            }
        });

        // Add action listener to demo button
        demoButton.addActionListener(e -> {
            try {
                Desktop.getDesktop().browse(new URI("http://localhost:8080"));
            } catch (IOException | URISyntaxException ex) {
                statusLabel.setText("Error opening demo: " + ex.getMessage());
                ex.printStackTrace();
            }
        });

        // Add components to panel
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.gridwidth = 2;
        gbc.anchor = GridBagConstraints.CENTER;
        loginPanel.add(titleLabel, gbc);

        gbc.gridy = 1;
        gbc.gridwidth = 2;
        gbc.insets = new Insets(20, 5, 20, 5);
        JLabel subtitleLabel = new JLabel("Sign in to create and edit your interactive 3D forest resume");
        loginPanel.add(subtitleLabel, gbc);

        gbc.gridy = 2;
        gbc.gridwidth = 1;
        gbc.anchor = GridBagConstraints.EAST;
        gbc.insets = new Insets(5, 5, 5, 5);
        loginPanel.add(usernameLabel, gbc);

        gbc.gridx = 1;
        gbc.anchor = GridBagConstraints.WEST;
        loginPanel.add(usernameField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 3;
        gbc.anchor = GridBagConstraints.EAST;
        loginPanel.add(passwordLabel, gbc);

        gbc.gridx = 1;
        gbc.anchor = GridBagConstraints.WEST;
        loginPanel.add(passwordField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 4;
        gbc.gridwidth = 2;
        gbc.anchor = GridBagConstraints.CENTER;
        gbc.insets = new Insets(20, 5, 5, 5);
        loginPanel.add(loginButton, gbc);

        gbc.gridy = 5;
        loginPanel.add(demoButton, gbc);

        gbc.gridy = 6;
        gbc.insets = new Insets(10, 5, 5, 5);
        loginPanel.add(statusLabel, gbc);
    }

    private void createRegisterPanel() {
        registerPanel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);

        // Create components
        JLabel titleLabel = new JLabel("Resume Forest - Register");
        titleLabel.setFont(new Font("Arial", Font.BOLD, 24));

        JLabel firstNameLabel = new JLabel("First Name:");
        JTextField firstNameField = new JTextField(20);

        JLabel lastNameLabel = new JLabel("Last Name:");
        JTextField lastNameField = new JTextField(20);

        JLabel emailLabel = new JLabel("Email:");
        JTextField emailField = new JTextField(20);

        JLabel usernameLabel = new JLabel("Username:");
        JTextField usernameField = new JTextField(20);

        JLabel passwordLabel = new JLabel("Password:");
        JPasswordField passwordField = new JPasswordField(20);

        JLabel confirmPasswordLabel = new JLabel("Confirm Password:");
        JPasswordField confirmPasswordField = new JPasswordField(20);

        JButton registerButton = new JButton("Register");
        JLabel statusLabel = new JLabel("");
        statusLabel.setForeground(Color.RED);

        // Add action listener to register button
        registerButton.addActionListener(e -> {
            String firstName = firstNameField.getText();
            String lastName = lastNameField.getText();
            String email = emailField.getText();
            String username = usernameField.getText();
            String password = new String(passwordField.getPassword());
            String confirmPassword = new String(confirmPasswordField.getPassword());

            if (firstName.isEmpty() || lastName.isEmpty() || email.isEmpty() || username.isEmpty() || password.isEmpty()) {
                statusLabel.setText("Please fill in all fields");
                return;
            }

            if (!password.equals(confirmPassword)) {
                statusLabel.setText("Passwords do not match");
                return;
            }

            try {
                register(firstName, lastName, email, username, password, statusLabel);
            } catch (Exception ex) {
                statusLabel.setText("Registration error: " + ex.getMessage());
                ex.printStackTrace();
            }
        });

        // Add components to panel
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.gridwidth = 2;
        gbc.anchor = GridBagConstraints.CENTER;
        registerPanel.add(titleLabel, gbc);

        gbc.gridy = 1;
        gbc.gridwidth = 2;
        gbc.insets = new Insets(20, 5, 20, 5);
        JLabel subtitleLabel = new JLabel("Create an account to build your interactive 3D forest resume");
        registerPanel.add(subtitleLabel, gbc);

        gbc.gridy = 2;
        gbc.gridwidth = 1;
        gbc.anchor = GridBagConstraints.EAST;
        gbc.insets = new Insets(5, 5, 5, 5);
        registerPanel.add(firstNameLabel, gbc);

        gbc.gridx = 1;
        gbc.anchor = GridBagConstraints.WEST;
        registerPanel.add(firstNameField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 3;
        gbc.anchor = GridBagConstraints.EAST;
        registerPanel.add(lastNameLabel, gbc);

        gbc.gridx = 1;
        gbc.anchor = GridBagConstraints.WEST;
        registerPanel.add(lastNameField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 4;
        gbc.anchor = GridBagConstraints.EAST;
        registerPanel.add(emailLabel, gbc);

        gbc.gridx = 1;
        gbc.anchor = GridBagConstraints.WEST;
        registerPanel.add(emailField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 5;
        gbc.anchor = GridBagConstraints.EAST;
        registerPanel.add(usernameLabel, gbc);

        gbc.gridx = 1;
        gbc.anchor = GridBagConstraints.WEST;
        registerPanel.add(usernameField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 6;
        gbc.anchor = GridBagConstraints.EAST;
        registerPanel.add(passwordLabel, gbc);

        gbc.gridx = 1;
        gbc.anchor = GridBagConstraints.WEST;
        registerPanel.add(passwordField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 7;
        gbc.anchor = GridBagConstraints.EAST;
        registerPanel.add(confirmPasswordLabel, gbc);

        gbc.gridx = 1;
        gbc.anchor = GridBagConstraints.WEST;
        registerPanel.add(confirmPasswordField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 8;
        gbc.gridwidth = 2;
        gbc.anchor = GridBagConstraints.CENTER;
        gbc.insets = new Insets(20, 5, 5, 5);
        registerPanel.add(registerButton, gbc);

        gbc.gridy = 9;
        gbc.insets = new Insets(10, 5, 5, 5);
        registerPanel.add(statusLabel, gbc);
    }

    private void createDashboardPanel() {
        dashboardPanel = new JPanel(new BorderLayout());

        // Create components
        JPanel headerPanel = new JPanel(new BorderLayout());
        JLabel welcomeLabel = new JLabel("Welcome to Resume Forest!");
        welcomeLabel.setFont(new Font("Arial", Font.BOLD, 20));
        JButton logoutButton = new JButton("Logout");
        headerPanel.add(welcomeLabel, BorderLayout.WEST);
        headerPanel.add(logoutButton, BorderLayout.EAST);

        // Add action listener to logout button
        logoutButton.addActionListener(e -> logout());

        // Create resume list panel
        JPanel resumeListPanel = new JPanel();
        resumeListPanel.setLayout(new BoxLayout(resumeListPanel, BoxLayout.Y_AXIS));
        JLabel resumeListLabel = new JLabel("Your Resumes:");
        resumeListLabel.setFont(new Font("Arial", Font.BOLD, 16));
        resumeListPanel.add(resumeListLabel);
        resumeListPanel.add(Box.createVerticalStrut(10));

        JPanel actionsPanel = new JPanel(new FlowLayout(FlowLayout.LEFT));
        JButton createResumeButton = new JButton("Create New Resume");
        JButton viewDemoButton = new JButton("View Demo Resume");
        actionsPanel.add(createResumeButton);
        actionsPanel.add(viewDemoButton);

        // Add action listeners
        createResumeButton.addActionListener(e -> createNewResume());
        viewDemoButton.addActionListener(e -> {
            try {
                Desktop.getDesktop().browse(new URI("http://localhost:8080"));
            } catch (IOException | URISyntaxException ex) {
                JOptionPane.showMessageDialog(this, "Error opening demo: " + ex.getMessage(),
                        "Error", JOptionPane.ERROR_MESSAGE);
                ex.printStackTrace();
            }
        });

        // Add components to dashboard panel
        dashboardPanel.add(headerPanel, BorderLayout.NORTH);
        dashboardPanel.add(resumeListPanel, BorderLayout.CENTER);
        dashboardPanel.add(actionsPanel, BorderLayout.SOUTH);

        // Load user's resumes
        loadUserResumes(resumeListPanel);
    }

    private void login(String username, String password, JLabel statusLabel) {
        try {
            // Prepare JSON payload
            JSONObject json = new JSONObject();
            json.put("username", username);
            json.put("password", password);            // Create HTTP request
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_BASE_URL + "/auth/v1/login"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json.toString()))
                    .build();

            // Send request and handle response
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JSONObject responseJson = new JSONObject(response.body());
                authToken = responseJson.getString("token");
                currentUserId = responseJson.getString("userId");

                // Remove login and register tabs
                tabbedPane.removeAll();

                // Create and add dashboard panel
                createDashboardPanel();
                tabbedPane.addTab("Dashboard", dashboardPanel);

                statusLabel.setText("");
            } else {
                statusLabel.setText("Invalid username or password");
            }
        } catch (Exception e) {
            statusLabel.setText("Login error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void register(String firstName, String lastName, String email, String username, String password, JLabel statusLabel) {
        try {
            // Prepare JSON payload
            JSONObject json = new JSONObject();
            json.put("firstName", firstName);
            json.put("lastName", lastName);
            json.put("email", email);
            json.put("username", username);
            json.put("password", password);            // Create HTTP request
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_BASE_URL + "/auth/v1/signup"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json.toString()))
                    .build();

            // Send request and handle response
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 201) {
                statusLabel.setText("Registration successful! Please login.");
                statusLabel.setForeground(new Color(0, 128, 0)); // Green color for success
                tabbedPane.setSelectedIndex(0); // Switch to login tab
            } else {
                JSONObject responseJson = new JSONObject(response.body());
                statusLabel.setText("Registration failed: " + responseJson.optString("message", "Unknown error"));
                statusLabel.setForeground(Color.RED); // Ensure color is red for failure
            }
        } catch (Exception e) {
            statusLabel.setText("Registration error: " + e.getMessage());
            statusLabel.setForeground(Color.RED); // Ensure color is red for exception
            e.printStackTrace();
        }
    }

    private void logout() {
        authToken = null;
        currentUserId = null;

        // Remove all tabs
        tabbedPane.removeAll();

        // Recreate login and register panels
        createLoginPanel();
        createRegisterPanel();

        // Add panels to tabbed pane
        tabbedPane.addTab("Login", loginPanel);
        tabbedPane.addTab("Register", registerPanel);
    }

    private void loadUserResumes(JPanel resumeListPanel) {
        // Clear previous resumes if any, except the label
        Component[] components = resumeListPanel.getComponents();
        for (int i = components.length -1; i >=0; i--) {
            if (!(components[i] instanceof JLabel && ((JLabel)components[i]).getText().equals("Your Resumes:")) &&
                !(components[i] instanceof Box.Filler)) {
                 resumeListPanel.remove(components[i]);
            }
        }
        // Ensure the "Your Resumes:" label and initial strut are present if they were somehow removed
        if (resumeListPanel.getComponentCount() == 0 ||
           !(resumeListPanel.getComponent(0) instanceof JLabel && ((JLabel)resumeListPanel.getComponent(0)).getText().equals("Your Resumes:"))) {
            resumeListPanel.removeAll(); // Clear all in case of unexpected state
            JLabel resumeListLabel = new JLabel("Your Resumes:");
            resumeListLabel.setFont(new Font("Arial", Font.BOLD, 16));
            resumeListPanel.add(resumeListLabel);
            resumeListPanel.add(Box.createVerticalStrut(10));
        }


        try {
            // Create HTTP request
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_BASE_URL + "/resumes"))
                    .header("Authorization", "Bearer " + authToken)
                    .GET()
                    .build();

            // Send request and handle response
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JSONObject responseJson = new JSONObject(response.body());

                // Add resumes to the list
                if (responseJson.has("resumes") && responseJson.get("resumes") instanceof org.json.JSONArray) {
                    for (Object resume : responseJson.getJSONArray("resumes")) {
                        JSONObject resumeJson = (JSONObject) resume;
                        String resumeId = resumeJson.getString("id");
                        String resumeTitle = resumeJson.getString("title");

                        JPanel resumePanel = new JPanel(new BorderLayout());
                        JLabel resumeLabel = new JLabel(resumeTitle);

                        JPanel buttonsPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
                        JButton editButton = new JButton("Edit");
                        JButton viewButton = new JButton("View");
                        JButton deleteButton = new JButton("Delete");

                        buttonsPanel.add(editButton);
                        buttonsPanel.add(viewButton);
                        buttonsPanel.add(deleteButton);

                        resumePanel.add(resumeLabel, BorderLayout.WEST);
                        resumePanel.add(buttonsPanel, BorderLayout.EAST);

                        resumeListPanel.add(resumePanel);
                        resumeListPanel.add(Box.createVerticalStrut(5));

                        // Add action listeners
                        editButton.addActionListener(e -> editResume(resumeId));
                        viewButton.addActionListener(e -> viewResume(resumeId));
                        deleteButton.addActionListener(e -> deleteResume(resumeId, resumePanel, resumeListPanel));
                    }
                } else {
                     JLabel noResumesLabel = new JLabel("No resumes found.");
                     resumeListPanel.add(noResumesLabel);
                }
            } else {
                JLabel errorLabel = new JLabel("Error loading resumes: " + response.statusCode());
                errorLabel.setForeground(Color.RED);
                resumeListPanel.add(errorLabel);
            }
        } catch (Exception e) {
            JLabel errorLabel = new JLabel("Error loading resumes: " + e.getMessage());
            errorLabel.setForeground(Color.RED);
            resumeListPanel.add(errorLabel);
            e.printStackTrace();
        }
        resumeListPanel.revalidate();
        resumeListPanel.repaint();
    }

    private void createNewResume() {
        try {
            // Prepare JSON payload
            JSONObject json = new JSONObject();
            json.put("title", "Untitled Resume");
            // The API might infer the userId from the authToken, if not, ensure currentUserId is valid
            if (currentUserId == null) {
                 JOptionPane.showMessageDialog(this, "User ID is not set. Cannot create resume.",
                        "Error", JOptionPane.ERROR_MESSAGE);
                return;
            }
            // Assuming the backend uses the authenticated user's ID from the token,
            // sending userId in the body might be redundant or even cause issues if it doesn't match.
            // Check your API documentation. For now, I'll keep it as it was in your original code.
            json.put("userId", currentUserId);


            // Create HTTP request
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_BASE_URL + "/resumes"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + authToken)
                    .POST(HttpRequest.BodyPublishers.ofString(json.toString()))
                    .build();

            // Send request and handle response
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 201) {
                JSONObject responseJson = new JSONObject(response.body());
                String resumeId = responseJson.getString("id");

                // Refresh the resume list
                if (dashboardPanel != null) {
                    Component[] components = dashboardPanel.getComponents();
                    for(Component component : components) {
                        if (component instanceof JPanel && ((JPanel) component).getLayout() instanceof BoxLayout) {
                             loadUserResumes((JPanel) component); // Assuming this is the resumeListPanel
                             break;
                        } else if (component instanceof JScrollPane && ((JScrollPane) component).getViewport().getView() instanceof JPanel) {
                            // If resumeListPanel is inside a JScrollPane
                            JPanel listPanel = (JPanel) ((JScrollPane) component).getViewport().getView();
                            if (listPanel.getLayout() instanceof BoxLayout) {
                                loadUserResumes(listPanel);
                                break;
                            }
                        }
                    }
                     // Fallback: find the resumeListPanel directly if it's a field (which it is not globally)
                     // or re-create the dashboard to refresh. A more direct way is preferable.
                     // For now, we'll assume loadUserResumes needs to be called on the correct panel.
                     // A more robust way would be to pass resumeListPanel to this method or make it an instance variable.
                     // As a quick fix, if dashboardPanel is visible and contains resumeListPanel directly in CENTER:
                    Component centerComponent = dashboardPanel.getComponent(1); // Assuming BorderLayout with NORTH, CENTER, SOUTH
                    if (centerComponent instanceof JPanel) {
                        loadUserResumes((JPanel) centerComponent);
                    }
                }


                // Open resume editor in browser
                Desktop.getDesktop().browse(new URI("http://localhost:8080/resume/edit/" + resumeId));
            } else {
                JSONObject responseJson = new JSONObject(response.body());
                JOptionPane.showMessageDialog(this, "Error creating resume: " + responseJson.optString("message", "Status code " + response.statusCode()),
                                              "Error", JOptionPane.ERROR_MESSAGE);
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error creating resume: " + e.getMessage(),
                    "Error", JOptionPane.ERROR_MESSAGE);
            e.printStackTrace();
        }
    }

    private void editResume(String resumeId) {
        try {
            Desktop.getDesktop().browse(new URI("http://localhost:8080/resume/edit/" + resumeId));
        } catch (IOException | URISyntaxException e) {
            JOptionPane.showMessageDialog(this, "Error opening resume editor: " + e.getMessage(),
                    "Error", JOptionPane.ERROR_MESSAGE);
            e.printStackTrace();
        }
    }

    private void viewResume(String resumeId) {
        try {
            Desktop.getDesktop().browse(new URI("http://localhost:8080/resume/view/" + resumeId));
        } catch (IOException | URISyntaxException e) {
            JOptionPane.showMessageDialog(this, "Error opening resume viewer: " + e.getMessage(),
                    "Error", JOptionPane.ERROR_MESSAGE);
            e.printStackTrace();
        }
    }

    private void deleteResume(String resumeId, JPanel resumePanelToRemove, JPanel resumeListPanelContext) {
        int confirm = JOptionPane.showConfirmDialog(this,
                "Are you sure you want to delete this resume?",
                "Confirm Delete",
                JOptionPane.YES_NO_OPTION);

        if (confirm == JOptionPane.YES_OPTION) {
            try {
                // Create HTTP request
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(API_BASE_URL + "/resumes/" + resumeId))
                        .header("Authorization", "Bearer " + authToken)
                        .DELETE()
                        .build();

                // Send request and handle response
                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 200 || response.statusCode() == 204) { // 204 No Content is also success for DELETE
                    resumeListPanelContext.remove(resumePanelToRemove);
                    // Also remove the strut that might be after it
                    Component[] components = resumeListPanelContext.getComponents();
                    for (int i = 0; i < components.length; i++) {
                        if (components[i] == resumePanelToRemove) {
                            if (i + 1 < components.length && components[i+1] instanceof Box.Filler) {
                                resumeListPanelContext.remove(i+1); // remove the strut
                            }
                            break;
                        }
                    }
                    resumeListPanelContext.revalidate();
                    resumeListPanelContext.repaint();
                } else {
                    JSONObject responseJson = new JSONObject(response.body());
                    JOptionPane.showMessageDialog(this, "Error deleting resume: " + responseJson.optString("message", "Status code " + response.statusCode()),
                                                  "Error", JOptionPane.ERROR_MESSAGE);
                }
            } catch (Exception e) {
                JOptionPane.showMessageDialog(this, "Error deleting resume: " + e.getMessage(),
                        "Error", JOptionPane.ERROR_MESSAGE);
                e.printStackTrace();
            }
        }
    }

    public static void main(String[] args) {
        // Set look and feel to system default
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Start application
        SwingUtilities.invokeLater(() -> new DesktopApplication());
    }
}