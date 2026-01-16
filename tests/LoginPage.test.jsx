import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../src/Login/LoginPage";

// Mocking fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

describe("Testing suite for LoginPage component", () => {
  beforeEach(() => {
    render(<LoginPage />); //runs before every test in the suite
  });

  afterEach(() => {
    // some cleanup - runs after every test in the suite
    jest.clearAllMocks();
  });

  //   it("It is also used instead of test", () => {})

  test("Test if the component renders correctly", () => {
    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  test("Test if the input field works", () => {
    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(usernameInput, { target: { value: "emilys" } });
    fireEvent.change(passwordInput, { target: { value: "emilyspass" } });

    expect(usernameInput.value).toBe("emilys");
    expect(passwordInput.value).toBe("emilyspass");
  });

    test("Validate username input length", () => {
      const usernameInput = screen.getByLabelText(/Username/i);
      fireEvent.change(usernameInput, { target: { value: "verylong" } });
      expect(usernameInput.value.length).toBeLessThanOrEqual(8);
    });

    test("Validate password input length", () => {
      const passwordInput = screen.getByLabelText(/Password/i);
      fireEvent.change(passwordInput, { target: { value: "short" } });
      expect(passwordInput.value.length).toBeLessThan(8);
    });

  test("Display error when username is not provided", () => {
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.change(passwordInput, { target: { value: "emilyspass" } });
    fireEvent.click(submitButton);

    expect(screen.getByLabelText(/Username/i)).toBeInvalid();
  });

  test("Display error when password is not provided", () => {
    const usernameInput = screen.getByLabelText(/Username/i);
    const submitButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.change(usernameInput, { target: { value: "emilys" } });
    fireEvent.click(submitButton);

    expect(screen.getByLabelText(/Password/i)).toBeInvalid();
  });

    // test("Test if the button works and console log the credentials", () => {
    //   const consoleSpy = jest.spyOn(console, "log");

    //   const usernameInput = screen.getByLabelText(/Username/i);
    //   const passwordInput = screen.getByLabelText(/Password/i);
    //   const submitButton = screen.getByRole("button", { name: /Login/i });

    //   fireEvent.change(usernameInput, { target: { value: "emilys" } });
    //   fireEvent.change(passwordInput, { target: { value: "emilyspass" } });
    //   fireEvent.click(submitButton);

    //   expect(consoleSpy).toHaveBeenCalledWith({
    //     username: "emilys",
    //     password: "emilyspass",
    //   });

    //   consoleSpy.mockRestore();
    // });

  test("Submit the form and makes an API call", async () => {
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "emilys" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "emilyspass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://dummyjson.com/auth/login",
      expect.any(Object)
    );
  });
});
