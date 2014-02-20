class CreateWebrequests < ActiveRecord::Migration
  def change
    create_table :webrequests do |t|
		t.string :extension_id
		t.string :extension_name
		t.string :response_type
		t.string :request_type
		t.string :collection
		t.text :url
		
		t.timestamps
    end
  end
end
