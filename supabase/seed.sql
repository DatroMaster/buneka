DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_org_id uuid := gen_random_uuid();
  v_store_id uuid := gen_random_uuid();
BEGIN
  -- Insert Auth User
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change,
    email_change_token_new, recovery_token
  ) values (
    v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'demo@buneka.com',
    crypt('buneka123', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), '', '', '', ''
  );

  -- Insert Auth Identity
  insert into auth.identities (
    provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id
  ) values (
    v_user_id::text, v_user_id, format('{"sub":"%s","email":"demo@buneka.com"}', v_user_id::text)::jsonb, 'email', now(), now(), now(), gen_random_uuid()
  );

  -- Insert Organization
  insert into public.organizations (id, name, status)
  values (v_org_id, 'Demo İşletme', 'active');

  -- Insert Store
  insert into public.stores (id, organization_id, name, is_active)
  values (v_store_id, v_org_id, 'Merkez Şube', true);

  -- Insert App User
  insert into public.app_users (auth_user_id, organization_id, store_id, name, email, role, is_active)
  values (v_user_id, v_org_id, v_store_id, 'Demo Kullanıcı', 'demo@buneka.com', 'owner', true);

  -- Insert Product 1
  insert into public.products (organization_id, store_id, barcode, name, category, sale_price, stock_quantity)
  values (v_org_id, v_store_id, '123456789', 'Örnek Su 500ml', 'İçecek', 10.00, 100);

  -- Insert Product 2
  insert into public.products (organization_id, store_id, barcode, name, category, sale_price, stock_quantity)
  values (v_org_id, v_store_id, '8690000000011', 'Çikolata Mini', 'Atıştırmalık', 18.50, 50);

END $$;
