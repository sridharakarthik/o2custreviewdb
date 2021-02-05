/*global QUnit*/

sap.ui.define([
	"com/sap/o2custreviewdb/controller/reviewpage.controller"
], function (Controller) {
	"use strict";

	QUnit.module("reviewpage Controller");

	QUnit.test("I should test the reviewpage controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});