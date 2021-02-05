sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageToast"],function(e,t){"use strict";return e.extend("com.sap.o2custreviewdb.controller.reviewpage",{onInit:function(){},onViewSelection:function(e){var t=e.getParameters().item.getText();var s=this.getView().byId("CUSmartFilterBar");var i=s.getFilterData();if(t==="AllRequests"){i.Indicator={items:[{key:"A"}]}}else if(t==="MyRequests"){i.Indicator={items:[{key:"M"}]}}else if(t==="NotAssigned"){i.Indicator={items:[{key:"N"}]}}s.setFilterData(i,true);this.getView().byId("ReviewTable").rebindTable()},onAssignuser:function(){if(!this._oUserSelectionDialog){this._oUserSelectionDialog=sap.ui.xmlfragment(this.getView().getId(),"com.sap.o2custreviewdb.view.UserSelection",this);this.getView().byId("dp").addContent(this._oUserSelectionDialog)}this._oUserSelectionDialog.open()},onUserSelectionAssignment:function(e){var t=e.getParameter("selectedContexts")[0].getObject().UserId;this.callbackend(t)},callbackend:function(e){var s=this;var i;var o="3";this.getView().setBusy(true);var a=this.getView().byId("SmartMigTable");var n=a.getSelectedIndices();if(n.length){this.oModel=new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFC_CIC_APPL_SRV/",true);this.oModel.setUseBatch(true);for(var r=0;r<n.length;r++){var l=Object.create(null);i=a.getContextByIndex(n[r]).getObject();l.RequestId=i.RequestId;l.AssignedTo=e;l.Indicator=o;var d="(RequestId='"+i.RequestId+"',Indicator='"+o+"')";this.oModel.update("/CIC_REQUESTSet"+d,l,{method:"PUT",success:function(e,i){s.getView().setBusy(false);t.show("Update SUccessful");a.clearSelection();s.getView().byId("ReviewTable").rebindTable()},error:function(e){s.getView().setBusy(false);t.show("Update Failed Check Backend")}})}this.oModel.submitChanges()}else{this.getView().setBusy(false);t.show("No Records Selected")}this.getView().setBusy(false)},onPress:function(e){var s=this;var i,o;var a=e.getSource().getText();if(a==="AssignToME"){o="1"}else if(a==="RemoveAssignment"){o="2"}else if(a==="AssignToUser"){this.onAssignuser();var n=this.onUserSelectionAssignment()}if(o){this.getView().setBusy(true);var r=this.getView().byId("SmartMigTable");var l=r.getSelectedIndices();if(l.length){this.oModel=new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFC_CIC_APPL_SRV/",true);this.oModel.setUseBatch(true);for(var d=0;d<l.length;d++){var c=Object.create(null);i=r.getContextByIndex(l[d]).getObject();c.RequestId=i.RequestId;c.Indicator=o;c.AssignedTo=n;if(a==="AssignToME"){var g="(RequestId='"+i.RequestId+"',Indicator='"+o+"')"}else if(a==="RemoveAssignment"){g="(RequestId='"+i.RequestId+"',Indicator='"+o+"')"}else if(a==="AssignToUser"){g="(RequestId='"+i.RequestId+"',AssignedTo='"+n+"')"}this.oModel.update("/CIC_REQUESTSet"+g,c,{method:"PUT",success:function(e,i){s.getView().setBusy(false);t.show("Update SUccessful");r.clearSelection();s.getView().byId("ReviewTable").rebindTable()},error:function(e){s.getView().setBusy(false);t.show("Update Failed Check Backend")}})}this.oModel.submitChanges()}else{this.getView().setBusy(false);t.show("No Records Selected")}this.getView().setBusy(false)}},onStaChg:function(){if(!this._oUserSelectDialog){this._oUserSelectDialog=sap.ui.xmlfragment(this.getView().getId(),"com.sap.o2custreviewdb.view.StatusChange",this)}this._oUserSelectDialog.open()},onCloseDialog:function(){this._oUserSelectDialog.close()}})});