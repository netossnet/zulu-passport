import assertRevert from "zeppelin-solidity/test/helpers/assertRevert";
const { createPassportCloneFactory } = require("./helper/deploy");

contract("PassportCloneFactory", ([user1, issuerZulu, , citizen1]) => {
  let passportCloneFactory;

  beforeEach(async () => {
    ({ passportCloneFactory } = await createPassportCloneFactory(issuerZulu));
  });

  describe("#createPassportByOwner", () => {
    it("should create new passport for user", async () => {
      (await passportCloneFactory.passports(user1)).should.be.eq(
        "0x0000000000000000000000000000000000000000"
      );
      await passportCloneFactory.createPassportByOwner(user1, {
        from: issuerZulu
      });
      (await passportCloneFactory.passports(user1)).should.not.be.eq(
        "0x0000000000000000000000000000000000000000"
      );
    });

    it("should only create one passport per user", async () => {
      await passportCloneFactory.createPassportByOwner(user1, {
        from: issuerZulu
      });
      await assertRevert(
        passportCloneFactory.createPassportByOwner(user1, { from: issuerZulu })
      );
    });

    it("should only be callable by owner", async () => {
      await assertRevert(
        passportCloneFactory.createPassportByOwner(user1, { from: user1 })
      );
    });
  });

  describe("#createPassport", () => {
    it("should create new passport for user", async () => {
      (await passportCloneFactory.passports(user1)).should.be.eq(
        "0x0000000000000000000000000000000000000000"
      );
      await passportCloneFactory.createPassport({ from: user1 });
      (await passportCloneFactory.passports(user1)).should.not.be.eq(
        "0x0000000000000000000000000000000000000000"
      );
    });

    it("should only create one passport per user", async () => {
      await passportCloneFactory.createPassport({ from: user1 });
      await assertRevert(passportCloneFactory.createPassport({ from: user1 }));
    });
  });
});
