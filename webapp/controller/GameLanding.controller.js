sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.gb.gamexsandos.controller.GameLanding", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.gb.gamexsandos.view.GameLanding
		 */
		onInit: function () {
			this.getOwnerComponent().getRouter().getRoute("gameLanding").attachPatternMatched(this._gamelandingPageRouteMatchedMethod, this);
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.gb.gamexsandos.view.GameLanding
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.gb.gamexsandos.view.GameLanding
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.gb.gamexsandos.view.GameLanding
		 */
		//	onExit: function() {
		//
		//	}
		_gamelandingPageRouteMatchedMethod: function () {
			this.getView().setModel(new sap.ui.model.json.JSONModel({}), "gameLocalModel");
			this.combArray = this.makeCombinationArray();
			this.currentValue = "X";
		},
		_getPropFromModel: function (modelName, prop) {
			return this.getView().getModel(modelName).getProperty(prop);
		},
		onClearGame: function () {
			this._gamelandingPageRouteMatchedMethod();
		},
		onAddValue: function (oEvent) {
			var path = oEvent.getSource().getBindingInfo("text").parts[0].path;
			this.getView().getModel("gameLocalModel").setProperty(path, this.currentValue);
			this.currentValue = this.currentValue === 'X' ? 'O' : 'X';
			this.checkWinner();
		},
		makeCombinationArray: function () {
			var noOfRows = 3;
			var noOfColumns = 3;
			var combArray = [];

			var rNumbers = [];
			var cNumbers = [];
			for (let r = 1; r <= noOfRows; r++) {
				rNumbers.push(r);
			}
			for (let c = 1; c <= noOfColumns; c++) {
				cNumbers.push(c);
			}

			// depending on rows 
			rNumbers.forEach((rowNum) => {
				var arrToPush = [];
				cNumbers.forEach((cNumb) => {
					arrToPush.push(rowNum + "x" + cNumb);
				});
				combArray.push(arrToPush);
			});

			// depending on columns 
			cNumbers.forEach((cNumb) => {
				var arrToPush = [];
				rNumbers.forEach((rowNum) => {
					arrToPush.push(rowNum + "x" + cNumb);
				});
				combArray.push(arrToPush);
			});
			// diag
			if (noOfRows === noOfColumns) {
				var arrToPushDia_one = [];
				for (let ix = 1; ix <= noOfRows && ix <= noOfColumns; ix++) {
					arrToPushDia_one.push(ix + "x" + ix);
				}
				combArray.push(arrToPushDia_one);
				var arrToPushDia_two = [];
				for (let ix = 1, iy = noOfColumns; ix <= noOfRows && iy >= 1; ix++, iy--) {
					arrToPushDia_two.push(ix + "x" + iy);
				}
				combArray.push(arrToPushDia_two);
			}
			return {combArray : combArray , rNumbers: rNumbers, cNumbers: cNumbers};
		},
		checkWinner: function () {
			var combinationOfWins = this.combArray;
			var winner = false;
			jQuery.each(combinationOfWins.combArray, (ix, obj) => {
				if (!winner) {
					winner = this._getPropFromModel("gameLocalModel", "/" + obj[0]) && this._getPropFromModel("gameLocalModel", "/" + obj[1]) &&
						this._getPropFromModel("gameLocalModel", "/" + obj[2]) && this._getPropFromModel("gameLocalModel", "/" + obj[0]) === this._getPropFromModel(
							"gameLocalModel", "/" + obj[1]) && this._getPropFromModel("gameLocalModel", "/" + obj[0]) === this._getPropFromModel(
							"gameLocalModel", "/" + obj[2]);
					if (winner) {
						var winnerChar = this._getPropFromModel("gameLocalModel", "/" + obj[0]);
						sap.m.MessageToast.show("Winner is " + winnerChar);
						return false;
					}
				}
			});
		}

	});

});