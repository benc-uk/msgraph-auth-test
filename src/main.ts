import { Client } from "@microsoft/microsoft-graph-client";
import { SimpleMSALAuthProvider } from "./auth";
import { clearError, getButton, setHTML, showError } from "./utils";

// Use the auth wrapper we created
// !!! CHANGE THE CLIENT ID BELOW !!!
const myProvider = new SimpleMSALAuthProvider("__CHANGE_ME__", ["user.read"]);

const graphClient = Client.initWithMiddleware({
  authProvider: myProvider,
});

getButton("detailsBtn").addEventListener("click", async () => {
  try {
    const user = await graphClient.api("/me").version("beta").get();

    setHTML(
      "userDetails",
      `<h4>💻 Graph API User Details</h4><ul>
      <li>Name: ${user.displayName}</li>
      <li>Mail: ${user.mail}</li>
      <li>Alias: ${user.mailNickname}</li>
      <li>Title: ${user.jobTitle}</li>
      <li>Dept: ${user.department}</li>
      <li>Location: ${user.officeLocation}</li>
      <li>City: ${user.city}</li>
      <li>Mobile: ${user.mobilePhone}</li>
      <li>Phone: ${user.businessPhones[0]}</li>
    </ul>`
    );

    clearError();

    // Get photo from API and display it
    const photoBlob = await graphClient.api("/me/photo/$value").get();
    const photoUrl = URL.createObjectURL(photoBlob);

    setHTML(
      "userDetails",
      `<h4>📷 Graph API User Photo</h4>
      <img src="${photoUrl}" style="width:300px; border-radius:8px" />`,
      true
    );
  } catch (error) {
    showError(error);
  }
});

getButton("tokenBtn").addEventListener("click", async () => {
  try {
    const resp = myProvider.authResponse;
    setHTML("userDetails", `<h4>🗃️ MSAL Response Dump</h4><pre>${JSON.stringify(resp, null, 2)}</pre>`);
  } catch (error) {
    showError(error);
  }
});

getButton("logoutBtn").addEventListener("click", () => {
  myProvider.logout();
});
