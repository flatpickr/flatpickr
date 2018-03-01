import flatpickr from "../index";

describe("flatpickr SSR", () => {
  it("can be imported", () => {
    expect(typeof flatpickr).toEqual("function");
  });
});
