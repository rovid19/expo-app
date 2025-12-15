import AsyncStorage from "@react-native-async-storage/async-storage";

const FACEBOOK_COOKIES_KEY = "@facebook_cookies";
const FACEBOOK_AUTH_KEY = "@facebook_auth_status";

export class FacebookService {
  static async saveCookies(cookies: string): Promise<void> {
    try {
      await AsyncStorage.setItem(FACEBOOK_COOKIES_KEY, cookies);
    } catch (error) {
      console.error("Error saving Facebook cookies:", error);
    }
  }

  static async getCookies(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(FACEBOOK_COOKIES_KEY);
    } catch (error) {
      console.error("Error retrieving Facebook cookies:", error);
      return null;
    }
  }

  static async clearCookies(): Promise<void> {
    try {
      await AsyncStorage.removeItem(FACEBOOK_COOKIES_KEY);
    } catch (error) {
      console.error("Error clearing Facebook cookies:", error);
    }
  }

  static async saveAuthStatus(isAuthenticated: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(
        FACEBOOK_AUTH_KEY,
        JSON.stringify({ isAuthenticated, timestamp: Date.now() })
      );
    } catch (error) {
      console.error("Error saving auth status:", error);
    }
  }

  static async getAuthStatus(): Promise<{
    isAuthenticated: boolean;
    timestamp: number;
  } | null> {
    try {
      const data = await AsyncStorage.getItem(FACEBOOK_AUTH_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error retrieving auth status:", error);
      return null;
    }
  }

  static async clearAuthStatus(): Promise<void> {
    try {
      await AsyncStorage.removeItem(FACEBOOK_AUTH_KEY);
    } catch (error) {
      console.error("Error clearing auth status:", error);
    }
  }

  static async logout(): Promise<void> {
    await this.clearCookies();
    await this.clearAuthStatus();
  }

  static isAuthExpired(timestamp: number, expiryHours: number = 24): boolean {
    const now = Date.now();
    const expiryTime = timestamp + expiryHours * 60 * 60 * 1000;
    return now > expiryTime;
  }

  static validateListingData(listing: {
    title: string;
    price: number;
    description: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!listing.title || listing.title.trim().length === 0) {
      errors.push("Title is required");
    }

    if (listing.title.length > 100) {
      errors.push("Title must be less than 100 characters");
    }

    if (!listing.price || listing.price <= 0) {
      errors.push("Price must be greater than 0");
    }

    if (listing.price > 1000000) {
      errors.push("Price is too high");
    }

    if (!listing.description || listing.description.trim().length === 0) {
      errors.push("Description is required");
    }

    if (listing.description.length > 5000) {
      errors.push("Description must be less than 5000 characters");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export default FacebookService;
