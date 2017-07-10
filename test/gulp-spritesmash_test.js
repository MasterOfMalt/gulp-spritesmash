/* global before, describe, it*/
"use strict";

const assert = require("assert");
const rimraf = require("rimraf");
const fs = require("fs");
const _ = require("lodash");
var eol = require("eol");
const childUtils = require("./utils/child.js");

before(function(done) {
  rimraf(__dirname + "/actual-files/", done);
});

const names = ["default", "scss", "less"];

describe("gulp-spritesmash", function() {
  names.forEach(function(name) {
    ["A", "B", "C"].forEach(function(variation) {
      describe(`running a task without any options - ${name} : ${variation}`, function() {
        childUtils.run(`gulp sprite-${name}-${variation}`);

        it("generates an image", function() {
          assert.doesNotThrow(function() {
            const files = fs.readdirSync(
              __dirname + `/actual-files/${name}/${variation}/`
            );
            const spriteFile = _.find(files, function(item) {
              return item.match(/sprite-.*/g);
            });

            fs.readFileSync(
              __dirname + `/actual-files/${name}/${variation}/${spriteFile}`
            );
          });
        });

        it("generates a css file", function() {
          assert.doesNotThrow(function() {
            const actualFiles = fs.readdirSync(
              __dirname + `/actual-files/${name}/${variation}/`
            );
            const actualCssFile = _.find(actualFiles, function(item) {
              return item.match(/spriteCss\..*/g);
            });

            const expectedFiles = fs.readdirSync(
              __dirname + `/expected-files/${name}/${variation}/`
            );
            const expectedCssFile = _.find(expectedFiles, function(item) {
              return item.match(/spriteCss\..*/g);
            });

            const actualCss = fs.readFileSync(
              __dirname + `/actual-files/${name}/${variation}/${actualCssFile}`,
              "utf8"
            );
            const expectedCss = fs.readFileSync(
              __dirname +
                `/expected-files/${name}/${variation}/${expectedCssFile}`,
              "utf8"
            );
            assert.strictEqual(eol.lf(actualCss), eol.lf(expectedCss));
          });
        });
      });
    });
  }, this);

  describe("running spritesmash with rev", function() {
    childUtils.run("gulp rev-smash-markdown");

    it("should have all files with a hash", function() {
      const actualFiles = fs.readdirSync(__dirname + `/actual-files/rev/`);
      const filesHaveHash = _.every(actualFiles, function(item) {
        return item.match(/.*-.*/g);
      });

      assert.equal(filesHaveHash, true);
    });

    it("should change file with reved contents", function() {
      assert.doesNotThrow(function() {
        const actualFiles = fs.readdirSync(__dirname + `/actual-files/rev`);
        const actualCssFile = _.find(actualFiles, function(item) {
          return item.match(/text-.*/g);
        });

        const expectedFiles = fs.readdirSync(__dirname + `/expected-files/rev`);
        const expectedCssFile = _.find(expectedFiles, function(item) {
          return item.match(/text-.*/g);
        });

        const actualCss = fs.readFileSync(
          __dirname + `/actual-files/rev/${actualCssFile}`,
          "utf8"
        );
        const expectedCss = fs.readFileSync(
          __dirname + `/expected-files/rev/${expectedCssFile}`,
          "utf8"
        );
        assert.strictEqual(eol.lf(actualCss), eol.lf(expectedCss));
      });
    });
  });

  describe("running spritesmash with different hash functions", function() {
    ["MD5", "SHA1", "custom"].forEach(function(name) {
      describe("running hash function " + name, function() {
        childUtils.run(`gulp smash-Hash-${name}`);

        it("should have files with the correct hashes", function() {
          assert.doesNotThrow(function() {
            const actualFiles = fs.readdirSync(
              __dirname + `/actual-files/hash/${name}/`
            );

            actualFiles.forEach(function(fileName) {
              const actualFile = fs.readFileSync(
                __dirname + `/actual-files/hash/${name}/${fileName}`,
                "utf8"
              );
              const expectedFile = fs.readFileSync(
                __dirname + `/expected-files/hash/${name}/${fileName}`,
                "utf8"
              );
              assert.strictEqual(eol.lf(actualFile), eol.lf(expectedFile));
            });
          });
        });
      });
    });

    describe("running hash function custom-query", function() {
      childUtils.run(`gulp smash-Hash-custom-query`);

      it("should have files with the correct hashes", function() {
        assert.doesNotThrow(function() {
          const actualFiles = fs.readdirSync(
            __dirname + `/actual-files/hash/custom-query/`
          );

          actualFiles.forEach(function(fileName) {
            const actualFile = fs.readFileSync(
              __dirname + `/actual-files/hash/custom-query/${fileName}`,
              "utf8"
            );
            const expectedFile = fs.readFileSync(
              __dirname + `/expected-files/hash/custom-query/${fileName}`,
              "utf8"
            );
            assert.strictEqual(eol.lf(actualFile), eol.lf(expectedFile));
          });
        });
      });
    });

    describe("running hash function timestamp", function() {
      childUtils.run(`gulp smash-Hash-timestamp`);

      it("should have files with the correct hashes", function() {
        assert.doesNotThrow(function() {
          const actualFiles = fs.readdirSync(
            __dirname + `/actual-files/hash/timestamp`
          );
          const actualSpriteHashed = _.find(actualFiles, function(item) {
            return item.match(/sprite5-.*/g);
          });

          fs.readFileSync(
            __dirname + `/actual-files/hash/timestamp/${actualSpriteHashed}`,
            "utf8"
          );
          const actualFile = fs.readFileSync(
            __dirname + `/actual-files/hash/timestamp/text.md`,
            "utf8"
          );
          assert(actualFile.indexOf(actualSpriteHashed) > -1);
        });
      });
    });
  });

  describe("running any task", function() {
    childUtils.run("gulp sprite-default-A");
    childUtils.run("gulp sprite-default-B");

    it("generates a different image for different content", function() {
      assert.doesNotThrow(function() {
        const filesA = fs.readdirSync(__dirname + "/actual-files/default/A/");
        const nameA = _.find(filesA, function(item) {
          return item.match(/sprite-.*/g);
        });

        const filesB = fs.readdirSync(__dirname + "/actual-files/default/B/");
        const nameB = _.find(filesB, function(item) {
          return item.match(/sprite-.*/g);
        });

        assert.notEqual(nameA, nameB);
      });
    });
  });
});
