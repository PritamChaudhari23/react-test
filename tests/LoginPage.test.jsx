import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../src/Login/LoginPage";

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

const setup = () => {
  const usernameInput = screen.getByLabelText(/Username/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const loginButton = screen.getByRole("button", { name: /Login/i });

  return { usernameInput, passwordInput, loginButton };
};

describe("LoginPage Test Suite", () => {
  beforeEach(() => {
    render(<LoginPage />); //runs before every test in the suite
  });

  afterEach(() => {
    jest.resetAllMocks(); // some cleanup - runs after every test in the suite
  });

  // it("It is also used instead of test", () => {})

  test("Renders the fields and button correctly", () => {
    const { usernameInput, passwordInput, loginButton } = setup();

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  test("Allows user to type into input fields", async () => {
    const { usernameInput, passwordInput } = setup();

    await userEvent.type(usernameInput, "emilys");
    await userEvent.type(passwordInput, "emilyspass");

    expect(usernameInput).toHaveValue("emilys");
    expect(passwordInput).toHaveValue("emilyspass");
  });

  test("Shows error when username is missing", async () => {
    const { usernameInput, passwordInput, loginButton } = setup();

    await userEvent.type(passwordInput, "emilyspass");
    await userEvent.click(loginButton);

    expect(usernameInput).toBeInvalid();
  });

  test("Shows error when password is missing", async () => {
    const { usernameInput, passwordInput, loginButton } = setup();

    await userEvent.type(usernameInput, "emilys");
    await userEvent.click(loginButton);

    expect(passwordInput).toBeInvalid();
  });

  test("Username should not exceed max length 8 characters", async () => {
    const { usernameInput } = setup();
    await userEvent.type(usernameInput, "verylongusername");
    expect(usernameInput.value.length).toBeLessThanOrEqual(8);
  });

  test("Password should be invalid if less than 8 characters", async () => {
    const { passwordInput, loginButton } = setup();

    await userEvent.type(passwordInput, "short");
    await userEvent.click(loginButton);

    expect(passwordInput).toBeInvalid();
  });

  test("Submits form and makes API call when valid", async () => {
    const { usernameInput, passwordInput, loginButton } = setup();

    await userEvent.type(usernameInput, "emilys");
    await userEvent.type(passwordInput, "emilyspass");
    await userEvent.click(loginButton);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("https://dummyjson.com/auth/login", expect.any(Object));
  });

  test("logs API response to console on successful submit", async () => {
    const { usernameInput, passwordInput, loginButton } = setup();

    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => { });

    const mockResponse = { token: "abc123" };

    fetch.mockResolvedValueOnce({
      json: async () => mockResponse,
    });

    await userEvent.type(usernameInput, "emilys");
    await userEvent.type(passwordInput, "emilyspass");
    await userEvent.click(loginButton);

    expect(consoleSpy).toHaveBeenCalledWith(mockResponse);

    consoleSpy.mockRestore();
  });

  test("Prevent API call when form is invalid", async () => {
    const { loginButton } = setup();
    await userEvent.click(loginButton);
    expect(fetch).not.toHaveBeenCalled();
  });
});
