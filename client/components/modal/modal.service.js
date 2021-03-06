'use strict';

angular.module('devicelibApp')
.factory('Modal', function ($rootScope, $modal) {
    /**
     * Opens a modal
     * @param  {Object} scope      - an object to be merged with modal's scope
     * @param  {String} modalClass - (optional) class(es) to be applied to the modal
     * @return {Object}            - the instance $modal.open() returns
     */
     function openModal(scope, modalClass, type) {
      var modalScope = $rootScope.$new();
      scope = scope || {};
      modalClass = modalClass || 'modal-default';

      angular.extend(modalScope, scope);

      if (type === 'device') {
        return $modal.open({
          templateUrl: 'components/modal/modal.device.html',
          windowClass: modalClass,
          scope: modalScope
        });
      }

      if (type === 'remove') {
        return $modal.open({
          templateUrl: 'components/modal/modal.remove.html',
          windowClass: modalClass,
          scope: modalScope
        });
      }

      return $modal.open({
        templateUrl: 'components/modal/modal.html',
        windowClass: modalClass,
        scope: modalScope
      });
    }

    // Public API here
    return {

      /* Confirmation modals */
      confirm: {

        /**
         * Create a function to open a newUser confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
         * @param  {Function} del - callback, ran when newUser is confirmed
         * @return {Function}     - the function to open the modal (ex. myModalFn)
         */
         newUser: function(callback) {
          callback = callback || angular.noop;

          /**
           * Open a newUser confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed staight to callback callback
           */
           return function() {
            var newUserModal;
            var user = {
              email: '',
              name: ''
            };

            newUserModal = openModal({
              modal: {
                dismissable: true,
                title: 'Create new user',
                button: {
                  text: 'Save',
                  click: function(name, email) {
                    user.email = email;
                    user.name = name;
                    newUserModal.close(user);
                  }
                }
              }
            }, 'modal-danger');

            newUserModal.result.then(function(event) {
              callback.apply(event, [user]);
            });
          };
        },
        newDevice: function(device, cb) {
          cb = cb || angular.noop;

          return function() {
            var modal;
            modal = openModal({
              modal: {
                dismissable: true,
                title: 'New device detected',
                name: device.name,
                label: device.label,
                button: {
                  text: 'Save',
                  click: function(data) {
                    modal.close(data);
                  }
                }
              }
            }, 'modal-danger', 'device');
            modal.result.then(cb);
          }
        },
        remove: function(targetName, cb) {
          cb = cb || angular.noop;
          return function() {
            var modal;
            modal = openModal({
              modal: {
                dismissable: true,
                title: 'Are you sure you want to remove ' + targetName,
                buttonYes: {
                  text: 'Yes',
                  click: function() {
                    modal.close(true);
                  }
                },
                buttonNo: {
                  text: 'Cancel',
                  click: function() {
                    modal.close(false);
                  }
                }
              }
            }, 'modal-danger', 'remove');
            modal.result.then(cb);
          }
        }
      }
    };
  });
