var password_less = {};

password_less.authenticate = function (event) {
  event.preventDefault();

  let public_key_options = {
    challenge: new TextEncoder().encode(challenge),
    rpId: location.host
  };

  console.info('authenticate', public_key_options)

  navigator.credentials.get({
    publicKey: public_key_options
  }).then(password_less.authenticated, error);
};

password_less.authenticated = function (assertion, event) {
  console.info(event);
  console.info(event.target);
  console.info('assertion', assertion);
  console.log(
    'assertion.rawId',
    __url_safe_b64_encode__(assertion.rawId)
  );
  console.log(
    'assertion.response.authenticatorData',
    __url_safe_b64_encode__(assertion.response.authenticatorData)
  );
  console.log(
    'assertion.response.clientDataJSON',
    __url_safe_b64_encode__(assertion.response.clientDataJSON)
  );
  console.log(
    'assertion.response.signature',
    __url_safe_b64_encode__(assertion.response.signature)
  );
  console.log(
    'assertion.response.userHandle',
    __url_safe_b64_encode__(assertion.response.userHandle)
  );
  console.log(
    'attestation.getClientExtensionResults()',
    attestation.getClientExtensionResults()
  );
};

var error = function (reason) {
  console.log('error', reason);
}

var __url_safe_b64_encode__ = function (array_buffer) {
  var uint8_array = new Uint8Array(array_buffer).reduce(function (s, byte) {
    s + String.fromCharCode(byte), ''
  });
  return btoa(uint8_array).replace(/\//g, '_').replace(/\+/g, '-').replace(/=/g, '');
};