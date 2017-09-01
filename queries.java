// Get list for approval
String query = "SELECT * FROM users WHERE approved = 0"
ResultSet rs = con.executeQuery(query);

// Update Users
String update = "UPDATE users SET fName = ?, lName = ?, description = ? WHERE userId = ?";
PreparedStatement pSt = con.prepareStatement(update);
pSt.setString(1, user.fName);
pSt.setString(2, user.lName);
pSt.setString(3, user.description);
pSt.setInt(4, user.userId);

pSt.executeUpdate();

// Approve Users
String update = "UPDATE users SET approved = 1 WHERE userId = ?"
PreparedStatement pSt = con.prepareStatement(query);
pSt.setInt(1, userId);

pSt.executeUpdate();


// Give admin rights
String accType = rs.getString("accType");
if (accType.charAt(Constants.OFFS_ADMIN) == '1') {
	generateToken(email, Constants.TYPE_ADMIN);
} else if (accType.charAt(Constants.OFFS_RENTER) == '1') {
	generateToken(email, Constants.TYPE_RENTER);
} else if (accType.charAt(Constants.OFFS_USER) == '1') {
	generateToken(email, Constants.TYPE_USER);
}
