/*
 * @Date: 2020-06-18 22:59:56
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-13 18:33:04
 * @FilePath: \myadmin\.stylelintrc.js
 */

module.exports = {
    extends: 'stylelint-config-recommended', // 只检查会出错的css
    rules: {
      // https://stylelint.io/user-guide/rules/at-rule-no-unknown#at-rule-no-unknown
      "at-rule-no-unknown":[true,{ignoreAtRules: ["/for/", /extend/, "/mixin/","include"]}],
      "no-descending-specificity":null,
      // https://stylelint.io/user-guide/rules/no-duplicate-selectors#no-duplicate-selectors
      "no-duplicate-selectors": null,
      "font-family-no-missing-generic-family-keyword":null
    },
};
