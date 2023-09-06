//
// Very simple auth provider, which uses MSAL to handle auth and token acquisition
//

import { AuthenticationResult, PublicClientApplication } from "@azure/msal-browser";
import { AuthenticationProvider } from "@microsoft/microsoft-graph-client";

// Simple auth provider implements the AuthenticationProvider interface required by the Graph SDK
export class SimpleMSALAuthProvider implements AuthenticationProvider {
  private msalApp: PublicClientApplication;
  private _authResponse: AuthenticationResult;
  private scopes: string[];

  constructor(clientId: string, scopes: string[] = ["user.read"]) {
    this.scopes = scopes;

    this.msalApp = new PublicClientApplication({
      auth: {
        clientId,
        redirectUri: window.location.origin,
      },
    });

    this.msalApp.initialize();

    console.log("### SimpleMSALAuthProvider initialized with client:", clientId);
  }

  // This method is called before every request to the Graph API via the middleware
  async getAccessToken() {
    console.log("### getAccessToken...");

    try {
      // Try to get token silently first, will be fetched from cache if possible
      this._authResponse = await this.msalApp.acquireTokenSilent({
        scopes: this.scopes,
        account: this.msalApp.getAllAccounts()[0],
      });
    } catch (error) {
      // We could check the error type, but it's easier to just prompt the user to sign in
      console.log("### Failed to get token, prompting user to sign in");
      try {
        this._authResponse = await this.msalApp.acquireTokenPopup({
          scopes: this.scopes,
        });
      } catch (error) {
        throw error;
      }
    }

    if (this._authResponse.fromCache) {
      console.log("###   Returned cached token");
    } else {
      console.log("###   Returned token from authorization server");
    }

    return this._authResponse.accessToken;
  }

  async logout() {
    await this.msalApp.logoutPopup({
      account: this.msalApp.getAllAccounts()[0],
    });
  }

  get authResponse() {
    if (!this._authResponse) {
      throw new Error("No cached auth response, please call the API first");
    }

    return this._authResponse;
  }
}
