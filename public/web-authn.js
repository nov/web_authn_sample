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
      // requireResidentKey: true // NOTE: turn-off during debugging
    },
    user: user
  };
  console.log('register', public_key_options);

  navigator.credentials.create({
    publicKey: public_key_options
  }).then((attestation) => {
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
    event.target.attestation_object.value = __url_safe_b64_encode__(attestation.response.attestationObject);
    event.target.client_data_json.value = __url_safe_b64_encode__(attestation.response.clientDataJSON);
    event.target.removeEventListener('submit', password_less.regsiter);
    // event.target.submit();
  }, error);
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
  }).then((assertion) => {
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
    event.target.authenticator_data.value = __url_safe_b64_encode__(attestation.response.authenticatorData);
    event.target.client_data_json.value = __url_safe_b64_encode__(attestation.response.clientDataJSON);
    event.target.signature.value = __url_safe_b64_encode__(attestation.response.signature);
    event.target.credential_id.value = __url_safe_b64_encode__(assertion.rawId);
    event.target.removeEventListener('submit', password_less.register);
    // event.target.submit();
  }, error);
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