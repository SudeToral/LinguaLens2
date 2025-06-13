import { Platform } from "react-native";
import { Account, Client, Databases } from "react-native-appwrite";

// Type guard to ensure environment variables are defined
const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const iosBundleId = process.env.EXPO_PUBLIC_APPWRITE_BUNDLE_ID;
const androidPackageName = process.env.EXPO_PUBLIC_APPWRITE_PACKAGE_NAME;

if (!endpoint || !projectId) {
  throw new Error("Appwrite config: Missing endpoint or project ID.");
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId);

switch (Platform.OS) {
  case "ios":
    if (iosBundleId) {
      client.setPlatform(iosBundleId);
    }
    break;
  case "android":
    if (androidPackageName) {
      client.setPlatform(androidPackageName);
    }
    break;
}

const account = new Account(client);
const databases = new Databases(client);


export { account, client, databases };
