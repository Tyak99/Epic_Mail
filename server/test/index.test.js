import chai from "chai";

const { expect } = chai;

describe("Verify test framework is set up properly", () => {
  it("should verify test framwork is set up by passing", done => {
    expect(200).to.eql(200);
    done();
  });
});

