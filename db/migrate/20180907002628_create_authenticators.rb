class CreateAuthenticators < ActiveRecord::Migration[5.2]
  def change
    create_table :authenticators do |t|
      t.belongs_to :account
      t.string :credential_id, null: false
      t.binary :public_cose_key_cbor, null: false
      t.integer :sign_count, null: false
      t.timestamps
      t.index :credential_id, unique: true
    end
  end
end
