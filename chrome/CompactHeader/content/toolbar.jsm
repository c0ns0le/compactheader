/*# -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*-
# ***** BEGIN LICENSE BLOCK *****
# Version: MPL 1.1/GPL 2.0/LGPL 2.1
#
# The contents of this file are subject to the Mozilla Public License Version
# 1.1 (the "License"); you may not use this file except in compliance with
# the License. You may obtain a copy of the License at
# http://www.mozilla.org/MPL/
#
# Software distributed under the License is distributed on an "AS IS" basis,
# WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
# for the specific language governing rights and limitations under the
# License.
#
# The Original Code is Mozilla Communicator client code, released
# March 31, 1998.
#
# The Initial Developer of the Original Code is
# Netscape Communications Corporation.
# Portions created by the Initial Developer are Copyright (C) 1998-1999
# the Initial Developer. All Rights Reserved.
#
# Contributor(s):
#   Joachim Herb <joachim.herb@gmx.de>
#
# Alternatively, the contents of this file may be used under the terms of
# either the GNU General Public License Version 2 or later (the "GPL"), or
# the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
# in which case the provisions of the GPL or the LGPL are applicable instead
# of those above. If you wish to allow use of your version of this file only
# under the terms of either the GPL or the LGPL, and not to allow others to
# use your version of this file under the terms of the MPL, indicate your
# decision by deleting the provisions above and replace them with the notice
# and other provisions required by the GPL or the LGPL. If you do not delete
# the provisions above, a recipient may use your version of this file under
# the terms of any one of the MPL, the GPL or the LGPL.
#
# ***** END LICENSE BLOCK *****
*/

EXPORTED_SYMBOLS = ["org"];

Components.utils.import("chrome://CompactHeader/content/debug.jsm");

if(!org) var org={};
if(!org.mozdev) org.mozdev={};
if(!org.mozdev.compactHeader) org.mozdev.compactHeader = {};


org.mozdev.compactHeader.toolbar = function() {
  var pub = {};

  var cohePrefBranch = Components.classes["@mozilla.org/preferences-service;1"]
                                          .getService(Components.interfaces.nsIPrefService)
                                          .getBranch("extensions.CompactHeader.");

  pub.fillToolboxPalette = function (doc) {
    org.mozdev.compactHeader.debug.log("fillToolboxPalette start");
    var hdrToolbar = doc.getElementById("header-view-toolbar");
    var hdrToolbox = doc.getElementById("header-view-toolbox");
    removeButtonDispMUA(doc);
    var buttons = ["button-reply", "button-replyall", "button-replylist", 
                   "button-tag", "button-forward", "button-archive", "button-file",
                   "button-print", "button-mark", "button-starMessages",
                   "button-newmsg", "button-goback", "button-goforward",
                   "button-previous", "button-next", "button-compact", 
                   "button-address", "button-stop", "button-getmsg",
                   "button-getPartialMessages",
                   "stylish-toolbar-button",
                   "button-enigmail-decrypt",
                   // support for https://addons.mozilla.org/thunderbird/addon/buttons/
                   "RealPreviousMessage", "RealNextMessage", "SelectSMTP",
                   "ToggleHTML", "ToggleImages", "bDeleteThread",
                   "mailredirect-toolbarbutton",
                   // support for https://addons.mozilla.org/thunderbird/addon/realprevnextbuttons/
                   //"realPrevMessageButton", "realNextMessageButton",
                   "lightningbutton-convert-to-task",
                   "lightningbutton-convert-to-event",
                   "button-dispMUA"];
    var currentSet=hdrToolbar.getAttribute("currentset");
    hdrToolbar.currentSet = currentSet;
    for (var i=0; i<buttons.length; i++) {
      var buttonName = buttons[i];
      var button = doc.getElementById(buttonName) || 
          doc.getElementById("mail-toolbox").palette.getElementsByAttribute("id", buttonName)[0];
      if (button) {
        var hdrButton = button.cloneNode(true);
        if (hdrButton) {
          if (hdrButton.localName == "toolbaritem") {
            var subButtons = hdrButton.querySelectorAll(".toolbarbutton-1");
            for (var j=0; j<subButtons.length; j++) {
              addClass(subButtons[j], "msgHeaderView-button-out");
            }
          } else {
            if (hdrButton.type != "menu-button") {
              addClass(hdrButton, "msgHeaderView-button");
            } else {
              addClass(hdrButton, "msgHeaderView-button-out");
            }
          }
          //hdrButton.id = "hdr" + hdrButton.id;
          hdrToolbox.palette.appendChild(hdrButton);
  /*        var bStyle = doc.defaultView.getComputedStyle(button, null);
          hdrButton.style.MozImageRegion = bStyle.MozImageRegion;
          hdrButton.style.listStyleImage = bStyle.listStyleImage;*/
        }
        if (currentSet.indexOf(buttonName)>=0) {
          var result = hdrToolbar.insertItem(hdrButton.id);
          currentSet = hdrToolbar.getAttribute("currentset");
          hdrToolbar.currentSet = currentSet;
        }
      }
    }

    var buttonsRemove = ["hdrForwardButton", "hdrArchiveButton",
                         "hdrReplyToSenderButton"];//, "hdrReplyButton",
                         //"hdrReplyAllButton", "hdrReplyListButton"];
    for (var i=0; i<buttonsRemove.length; i++) {
      var buttonName = buttonsRemove[i];
      var button = doc.getElementById(buttonName) || 
          doc.getElementById("header-view-toolbox").palette.getElementsByAttribute("id", buttonName)[0];
      if (button) {
        button.setAttribute("collapsed", "true");
      }
    }
    
    var target = "hdrOtherActionsButton";
    
    var newParent = doc.getElementById(target) || 
        doc.getElementById("header-view-toolbox").palette.getElementsByAttribute("id", target)[0];
  
    if (newParent != null) {
      var myElement;
      myElement= doc.getElementById("otherActionsPopup");
      if (myElement) {
        newParent.appendChild(myElement);
      }
    }
    org.mozdev.compactHeader.debug.log("fillToolboxPalette stop");
  };

  pub.setButtonStyle = function(doc) {
    org.mozdev.compactHeader.debug.log("setButtonStyle start");
    var hdrToolbar = doc.getElementById("header-view-toolbar");
    var hdrToolbox = doc.getElementById("header-view-toolbox");
    var buttons = hdrToolbar.querySelectorAll("toolbarbutton");
    for (var i=0; i<buttons.length; i++) {
      var button = buttons[i];
      if (button) {
        addClass(button, "customize-header-toolbar-button");
        addClass(button, "customize-header-toolbar-" + button.id)
        if (cohePrefBranch.getBoolPref("headersize.flatButtons")) {
          if (button.type != "menu-button") {
            addClass(button, "msgHeaderView-flat-button");
          } else {
            removeClass(button, "msgHeaderView-flat-button");
            removeClass(button, "msgHeaderView-button");
            removeClass(button, "msgHeaderView-button-out");
            addClass(button,    "msgHeaderView-flat-button-out");
          }
        } else {
          if (button.type != "menu-button") {
            removeClass(button, "msgHeaderView-flat-button");
          } else {
            removeClass(button, "msgHeaderView-flat-button");
            removeClass(button, "msgHeaderView-button");
            removeClass(button, "msgHeaderView-flat-button-out");
            addClass(button,    "msgHeaderView-button-out");
          }
        }
      }
    }

    org.mozdev.compactHeader.debug.log("setButtonStyle start 1");

    var buttons = hdrToolbar.querySelectorAll("toolbaritem");
    for (var i=0; i<buttons.length; i++) {
      var button = buttons[i];
      if (button) {
        addClass(button, "customize-header-toolbar-button");
        addClass(button, "customize-header-toolbar-" + button.id)
        if (cohePrefBranch.getBoolPref("headersize.flatButtons")) {
          removeClass(button, "msgHeaderView-button-out-item");
          addClass(button,    "msgHeaderView-flat-button-out-item");
        } else {
          removeClass(button, "msgHeaderView-flat-button-out-item");
          addClass(button,    "msgHeaderView-button-out-item");
        }
      }
    }
    
    buttons = hdrToolbox.palette.querySelectorAll("toolbarbutton");
    for (var i=0; i<buttons.length; i++) {
      var button = buttons[i];
      if (button) {
        addClass(button, "customize-header-toolbar-button");
        addClass(button, "customize-header-toolbar-" + button.id)
        if (cohePrefBranch.getBoolPref("headersize.flatButtons")) {
          if (button.getAttribute("type") != "menu-button") {
            addClass(button, "msgHeaderView-flat-button");
          } else {
            removeClass(button, "msgHeaderView-flat-button");
            removeClass(button, "msgHeaderView-button");
            removeClass(button, "msgHeaderView-button-out");
            addClass(button,    "msgHeaderView-flat-button-out");
          }
        } else {
          if (button.getAttribute("type") != "menu-button") {
            removeClass(button, "msgHeaderView-flat-button");
          } else {
            removeClass(button, "msgHeaderView-flat-button");
            removeClass(button, "msgHeaderView-button");
            removeClass(button, "msgHeaderView-flat-button-out");
            addClass(button,    "msgHeaderView-button-out");
          }
        }
      }
    }
    org.mozdev.compactHeader.debug.log("setButtonStyle start 2");

    buttons = hdrToolbox.palette.querySelectorAll("toolbaritem");
    for (var i=0; i<buttons.length; i++) {
      var button = buttons[i];
      if (button) {
        addClass(button, "customize-header-toolbar-button");
        addClass(button, "customize-header-toolbar-" + button.id)
        if (cohePrefBranch.getBoolPref("headersize.flatButtons")) {
          removeClass(button, "msgHeaderView-button-out-item");
          addClass(button,    "msgHeaderView-flat-button-out-item");
        } else {
          removeClass(button, "msgHeaderView-flat-button-out-item");
          addClass(button,    "msgHeaderView-button-out-item");
        }
      }
    }
    org.mozdev.compactHeader.debug.log("setButtonStyle stop");
  };
  
  pub.toggle = function(doc, aHeaderViewMode) {
    org.mozdev.compactHeader.debug.log("toolbar toggle start");
    var hdrToolbox = doc.getElementById("header-view-toolbox");
    var hdrToolbar = doc.getElementById("header-view-toolbar");
    var firstPermanentChild = hdrToolbar.firstPermanentChild;
    var lastPermanentChild = hdrToolbar.lastPermanentChild;
    if (aHeaderViewMode) {
      var cBox = doc.getElementById("collapsed2LButtonBox");
      if (cBox.parentNode.id != hdrToolbox.parentNode.id) {
        var cloneToolboxPalette;
        var cloneToolbarset;
        if (hdrToolbox.palette) {
          cloneToolboxPalette = hdrToolbox.palette.cloneNode(true);
        }
        if (hdrToolbox.toolbarset) {
          cloneToolbarset = hdrToolbox.toolbarset.cloneNode(true);
        }
        cBox.parentNode.insertBefore(hdrToolbox, cBox);
        hdrToolbox.palette  = cloneToolboxPalette;
        hdrToolbox.toolbarset = cloneToolbarset;
        hdrToolbar = doc.getElementById("header-view-toolbar");
        hdrToolbar.firstPermanentChild = firstPermanentChild;
        hdrToolbar.lastPermanentChild = lastPermanentChild;
      }
    } else {
      var cBox = doc.getElementById("expandedHeaders");
      if (cBox.parentNode.id != hdrToolbox.parentNode.id) {
        var cloneToolboxPalette;
        var cloneToolbarset;
        if (hdrToolbox.palette) {
          cloneToolboxPalette = hdrToolbox.palette.cloneNode(true);
        }
        if (hdrToolbox.toolbarset) {
          cloneToolbarset = hdrToolbox.toolbarset.cloneNode(true);
        }
        cBox.parentNode.appendChild(hdrToolbox);
        hdrToolbox.palette = cloneToolboxPalette;
        hdrToolbox.toolbarset = cloneToolbarset;
        hdrToolbar = doc.getElementById("header-view-toolbar");
        hdrToolbar.firstPermanentChild = firstPermanentChild;
        hdrToolbar.lastPermanentChild = lastPermanentChild;
      }
    }
    org.mozdev.compactHeader.debug.log("toolbar toggle stop");
  };

  pub.dispMUACheck = function(doc) {
    org.mozdev.compactHeader.debug.log("dispMUACheck start");
    var dispMUAButton = doc.getElementById("button-dispMUA");
    var dispMUABox = doc.getElementById("dispMUA"); 
    dispMUABox.setAttribute("collapsed", "true"); // hide original
    var IconContainerDispMUA = null;
    if (dispMUAButton) {
      /* expanded view 48 * 48 */
      if (IconContainerDispMUA = doc.getElementById("dispMUAiconExp")) {
        IconContainerDispMUA.setAttribute("collapsed", "true");
      }
      /* two line view 32 * 32 */
      if (IconContainerDispMUA = doc.getElementById("dispMUAicon2line")) {
        IconContainerDispMUA.setAttribute("collapsed", "true");
      }
      /* compact view 24 * 24 */
      if (IconContainerDispMUA = doc.getElementById("dispMUAiconCompact")) {
        IconContainerDispMUA.setAttribute("collapsed", "true");
      }

    }
    else if (dispMUABox){

      /* expanded view 48 * 48 */
      if (IconContainerDispMUA = doc.getElementById("dispMUAiconExp")) {
        IconContainerDispMUA.removeAttribute("collapsed");
      }
      if (cohePrefBranch.getBoolPref("headersize.twolineview")) {
        /* two line view 32 * 32 */
        if (IconContainerDispMUA = doc.getElementById("dispMUAicon2line"))
          IconContainerDispMUA.removeAttribute("collapsed");
        if (IconContainerDispMUA = doc.getElementById("dispMUAiconCompact"))
          IconContainerDispMUA.setAttribute("collapsed", "true");
      }
      else {
        /* compact view 24 * 24 */
        if (IconContainerDispMUA = doc.getElementById("dispMUAiconCompact"))
          IconContainerDispMUA.removeAttribute("collapsed");
        if (IconContainerDispMUA = doc.getElementById("dispMUAicon2line"))
          IconContainerDispMUA.setAttribute("collapsed", "true");
      }
    }
    org.mozdev.compactHeader.debug.log("dispMUACheck stop");
  };

  pub.onChangeDispMUAicon = function(event) {
    if (event.attrName == "src") {
      org.mozdev.compactHeader.debug.log("onChangeDispMUAicon start");
      var doc = event.originalTarget.ownerDocument;
      if (!doc) {
        org.mozdev.compactHeader.debug.log("onChangeDispMUAicon: no document!");
        return;
      }
      var imageSrc = doc.getElementById("dispMUAicon").getAttribute("src");
      var IconContainerDispMUA = null;
      /* toolbar button */
      if (IconContainerDispMUA = doc.getElementById("button-dispMUA")) {
        IconContainerDispMUA.setAttribute("image", imageSrc);
      }
      /* expanded view 48 * 48 */
      if (IconContainerDispMUA = doc.getElementById("dispMUAiconExp")) {
        IconContainerDispMUA.setAttribute("src", imageSrc);
      }
      /* two line view 32 * 32 */
      if (IconContainerDispMUA = doc.getElementById("dispMUAicon2line")) {
        IconContainerDispMUA.setAttribute("src", imageSrc);
      }
      /* compact view 24 * 24 */
      if (IconContainerDispMUA = doc.getElementById("dispMUAiconCompact")) {
        IconContainerDispMUA.setAttribute("src", imageSrc);
      }
      org.mozdev.compactHeader.debug.log("onChangeDispMUAicon stop");
    }
    else if (event.attrName == "tooltiptext") {
      org.mozdev.compactHeader.debug.log("onChangeDispMUAicon start");
      var doc = event.originalTarget.ownerDocument;
      if (!doc) {
        org.mozdev.compactHeader.debug.log("onChangeDispMUAicon: no document!");
        return;
      }
      var tooltipText = doc.getElementById("dispMUAicon").getAttribute("tooltiptext");
      var buttonDispMUA = doc.getElementById("button-dispMUA");
      if (buttonDispMUA) {
        buttonDispMUA.setAttribute("tooltiptext", tooltipText);
      }
      /* expanded view 48 * 48 */
      if (IconContainerDispMUA = doc.getElementById("dispMUAiconExp")) {
        IconContainerDispMUA.setAttribute("tooltiptext", tooltipText);
      }
      /* two line view 32 * 32 */
      if (IconContainerDispMUA = doc.getElementById("dispMUAicon2line")) {
        IconContainerDispMUA.setAttribute("tooltiptext", tooltipText);
      }
      /* compact view 24 * 24 */
      if (IconContainerDispMUA = doc.getElementById("dispMUAiconCompact")) {
        IconContainerDispMUA.setAttribute("tooltiptext", tooltipText);
      }
      org.mozdev.compactHeader.debug.log("onChangeDispMUAicon stop");
    }
  };
  
//  function onChangeHeaderToolbar(event) {
//    if (event.attrName == "currentset") {
//      if (doc.getElementById("button-dispMUA")) {
//        gDBView.reloadMessage();
//      }
//      dispMUACheck();
//      org.mozdev.compactHeader.buttons.coheToggleStar();
//    }
//  }
  
  removeButtonDispMUA = function(doc) {
    org.mozdev.compactHeader.debug.log("removeButtonDispMUA start");
    if (!doc.getElementById("dispMUA")) {
      var button = doc.getElementById("button-dispMUA");
      if (button) {
        button.parentNode.removeChild(button);
      }
      
      var button1 = doc.getElementById("mail-toolbox").palette.getElementsByAttribute("id", "button-dispMUA")[0];
      if (button1) {
        button1.parentNode.removeChild(button1);
      }

      var button2 = doc.getElementById("header-view-toolbox").palette.getElementsByAttribute("id", "button-dispMUA")[0];
      if (button2) {
        button2.parentNode.removeChild(button2);
      }
    }
    org.mozdev.compactHeader.debug.log("removeButtonDispMUA stop");
  };
  
  function addClass(el, strClass) {
    var testnew = new RegExp('\\b'+strClass+'\\b').test(el.className);  
    if (!testnew) {
      el.className += el.className?' '+strClass:strClass;
    }
  }
  
  function removeClass(el, strClass) {
    var str = new RegExp('(\\s|^)'+strClass+'(\\s|$)', 'g');
    el.className = el.className.replace(str, ' ');
  }
  

  return pub;
}();
