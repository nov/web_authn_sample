const cose_alg_ECDSA_w_SHA256 = -7;
const password_less = {};

password_less.regsiter = (event) => {
  event.preventDefault();

  let user = {
    id: new TextEncoder().encode(email.value),
    name: email.value,
    displayName: display_name.value
  };

  let public_key_options = {
    challenge: new TextEncoder().encode(challenge),
    pubKeyCredParams: [{
      type: 'public-key',
      alg: cose_alg_ECDSA_w_SHA256
    }],
    rp: {
      id: location.host,
      name: document.title
    },
    authenticatorSelection: {
      requireResidentKey: true
    },
    user: user
  };
  console.log('register', public_key_options);

  navigator.credentials.create({
    publicKey: public_key_options
  }).then(password_less.registered, error);
};

password_less.registered = (attestation, event) => {
  console.info(event);
  console.info(event.target);
  console.log('Attestation', attestation);
  console.log(
    'attestation.rawId',
    __url_safe_b64_encode__(attestation.rawId)
  );
  console.log(
    'attestation.response.attestationObject',
    __url_safe_b64_encode__(attestation.response.attestationObject)
  );
  console.log(
    'attestation.response.clientDataJSON',
    __url_safe_b64_encode__(attestation.response.clientDataJSON)
  );
  console.log(
    'attestation.getClientExtensionResults()',
    attestation.getClientExtensionResults()
  );
};

password_less.authenticate = (event) => {
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

password_less.authenticated = (assertion, event) => {
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

const error = (reason) => {
  console.log('error', reason);
}

const __url_safe_b64_encode__ = (array_buffer) => {
  let uint8_array = new Uint8Array(array_buffer).reduce(
    (s, byte) => s + String.fromCharCode(byte), ''
  );
  return btoa(uint8_array).replace(/\//g, '_').replace(/\+/g, '-').replace(/=/g, '');
};