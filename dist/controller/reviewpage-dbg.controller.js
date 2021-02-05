sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function (Controller, MessageToast) {
	"use strict";

	return Controller.extend("com.sap.o2custreviewdb.controller.reviewpage", {
		onInit: function () {

			// var oStatus = {
			// 	status: [{
			// 		val: "Inprocess"
			// 	}, {
			// 		val: "Parked"
			// 	}, {
			// 		val: "Resolved"
			// 	}, {
			// 		val: "Requested"
			// 	}]
			// };
			// // Create an instance of JSON Model using the Status data available above.
			// var oModel = new sap.ui.model.json.JSONModel(oStatus);
			// // Set the Model to the current view so that Model's data is available to 
			// // the entire view. It means any control within that view can use this 
			// // Model's data for binding unless another Model is bound to that specific control.
			// this.getView().setModel(oModel);
		},

		onViewSelection: function (oEve) {
			var tab = oEve.getParameters().item.getText();
			var oSmartFilter = this.getView().byId("CUSmartFilterBar");
			var s = oSmartFilter.getFilterData();

			if (tab === "AllRequests") {
				s.Indicator = {
					items: [{
						key: "A"
					}]
				};
			} else if (tab === "MyRequests") {
				s.Indicator = {
					items: [{
						key: "M"
					}]
				};
			} else if (tab === "NotAssigned") {
				s.Indicator = {
					items: [{
						key: "N"
					}]
				};
			}

			oSmartFilter.setFilterData(s, true);

			this.getView().byId("ReviewTable").rebindTable();

		},

		onAssignuser: function () {
			if (!this._oUserSelectionDialog) {
				this._oUserSelectionDialog = sap.ui.xmlfragment(this.getView().getId(),
					"com.sap.o2custreviewdb.view.UserSelection", this);
				this.getView().byId("dp").addContent(this._oUserSelectionDialog);
			}
			this._oUserSelectionDialog.open();
		},

		onUserSelectionAssignment: function (oEvent) {
			var sUserId = oEvent.getParameter("selectedContexts")[0].getObject().UserId;
			this.callbackend(sUserId);
		},
		callbackend: function (sUserId) {

			var that = this;
			var oSelectedContext;
			var indicate = "3";
			this.getView().setBusy(true);
			var oTab = this.getView().byId("SmartMigTable");
			var sItem = oTab.getSelectedIndices();
			if (sItem.length) {
				this.oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFC_CIC_APPL_SRV/", true);
				this.oModel.setUseBatch(true);

				for (var i = 0; i < sItem.length; i++) {
					var pdata = Object.create(null);
					oSelectedContext = oTab.getContextByIndex(sItem[i]).getObject();
					pdata.RequestId = oSelectedContext.RequestId;
					pdata.AssignedTo = sUserId;
					pdata.Indicator = indicate;
					var url = "(RequestId='" + oSelectedContext.RequestId + "',Indicator='" + indicate + "')";

					this.oModel.update("/CIC_REQUESTSet" + url, pdata, {
						method: "PUT",
						success: function (data, response) {
							that.getView().setBusy(false);
							MessageToast.show("Update SUccessful");
							oTab.clearSelection();
							that.getView().byId("ReviewTable").rebindTable();
						},
						error: function (oError) {
							that.getView().setBusy(false);
							MessageToast.show("Update Failed Check Backend");
						}
					});
				}
				this.oModel.submitChanges();
			} else {
				this.getView().setBusy(false);
				MessageToast.show("No Records Selected");
			}
			this.getView().setBusy(false);

		},

		onPress: function (oEvent) {
			var that = this;
			var oSelectedContext, indicate;
			var text = oEvent.getSource().getText();
			if (text === "AssignToME") {
				indicate = "1";
			} else if (text === "RemoveAssignment") {
				indicate = "2";
			} else if (text === "AssignToUser") {
				this.onAssignuser();
				var userId = this.onUserSelectionAssignment();
			}
			if (indicate) {
				this.getView().setBusy(true);
				var oTab = this.getView().byId("SmartMigTable");
				var sItem = oTab.getSelectedIndices();
				if (sItem.length) {
					this.oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFC_CIC_APPL_SRV/", true);
					this.oModel.setUseBatch(true);

					for (var i = 0; i < sItem.length; i++) {
						var oData = Object.create(null);
						oSelectedContext = oTab.getContextByIndex(sItem[i]).getObject();
						oData.RequestId = oSelectedContext.RequestId;
						oData.Indicator = indicate;
						oData.AssignedTo = userId;

						if (text === "AssignToME") {
							var oreqUrl = "(RequestId='" + oSelectedContext.RequestId + "',Indicator='" + indicate + "')";
						} else if (text === "RemoveAssignment") {
							oreqUrl = "(RequestId='" + oSelectedContext.RequestId + "',Indicator='" + indicate + "')";
						} else if (text === "AssignToUser") {
							oreqUrl = "(RequestId='" + oSelectedContext.RequestId + "',AssignedTo='" + userId + "')";
						}

						this.oModel.update("/CIC_REQUESTSet" + oreqUrl, oData, {
							method: "PUT",
							success: function (data, response) {
								that.getView().setBusy(false);
								MessageToast.show("Update SUccessful");
								oTab.clearSelection();
								that.getView().byId("ReviewTable").rebindTable();
							},
							error: function (oError) {
								that.getView().setBusy(false);
								MessageToast.show("Update Failed Check Backend");
							}
						});

					}
					this.oModel.submitChanges();
				} else {
					this.getView().setBusy(false);
					MessageToast.show("No Records Selected");
				}
				this.getView().setBusy(false);
			}
		},

		onStaChg: function () {
			if (!this._oUserSelectDialog) {
				this._oUserSelectDialog = sap.ui.xmlfragment(this.getView().getId(),
					"com.sap.o2custreviewdb.view.StatusChange", this);
			}
			this._oUserSelectDialog.open();
		},
		onCloseDialog: function () {
			this._oUserSelectDialog.close();
		}

	});
});