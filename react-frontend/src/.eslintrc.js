module.exports = {
  "extends": [
    "react-app",
    "react-app/jest"
  ],
  "plugins": [
  ],
  "env": {
  },
  "rules": {
    "default-case": 0,
    "no-sequences": 0,
    "testing-library/no-render-in-setup": 0,
    // This seems to catch a lot of non-node js code.
    "testing-library/no-node-access": 0,
    // This rule is not a very important optimization but we're also trying to
    // get rid of @testing-library assertions anyway.
    "testing-library/no-wait-for-multiple-assertions": 0,
    // If we're not using screen queries, there's a reason for that.
    "testing-library/prefer-screen-queries": 0,
  },
  "globals": {
    "any": "readonly"
  },
  "overrides": [
    {
      // Storybook specific rules
      "files": ["**/*.stories.*"],
      "rules": {
        "import/no-anonymous-default-export": "off"
      }
    }
  ]
};
