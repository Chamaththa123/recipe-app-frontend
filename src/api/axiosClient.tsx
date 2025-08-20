"use client";

import Cookies from "js-cookie";

//base url for api request
const BASE_URL = "http://localhost:8000/api";

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

//error structure for api errors
interface ApiError {
  status: number;
  statusText: string;
  data?: any;
}

const axiosClient = async (endpoint: string, options: FetchOptions = {}) => {
  const token = typeof window !== "undefined" ? Cookies.get("_auth") : null;

  //add token for headers
  const headers: HeadersInit = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (!(options.body instanceof FormData)) {
    (headers as { [key: string]: string })["Content-Type"] = "application/json";
  }

  //create api request
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    //if unauthorize clear cookies and redirect login 
    if (response.status === 401 && typeof window !== "undefined") {
      Cookies.remove("_auth");
      Cookies.remove("_user");
      window.location.href = "/guest/login";
    }

    const error: ApiError = {
      status: response.status,
      statusText: response.statusText,
      data: errorData,
    };

    throw error;
  }

  return response.json();
};

export default axiosClient;
