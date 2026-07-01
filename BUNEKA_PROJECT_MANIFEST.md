# BUNEKA PROJE MANİFESTOSU

## Codex ile Başlangıç, Antigravity ile Orkestrasyon

**Belge amacı:** Bu dosya, Buneka projesini sıfırdan yazılıma dönüştürmek için Codex, Antigravity ve geliştirici ekip tarafından okunacak ana proje manifestosudur.

**Marka:** Buneka  
**Domain hedefi:** buneka.com  
**Ürün türü:** Yıllık lisanslı SaaS  
**Ana slogan:** Barkodu okut, fiyatı gör, satışını bil.  
**Çekirdek vaat:** Küçük işletmenin fiyat, kasa ve stok hafızası.

---

## 0. Araç Stratejisi

Buneka projesinde tek bir araca bağlı kalınmayacaktır. Proje iki ana yapay zekâ geliştirme aracıyla ilerleyecektir.

### 0.1 Ana karar

| Araç | Ana görev | Kullanım biçimi |
|---|---|---|
| Codex | Kod üretimi, migration, test, API, hata çözümü | Terminal ve repo içinde doğrudan görev yürütme |
| Antigravity | Proje orkestrasyonu, çoklu ajan planlama, tasarım ve modül koordinasyonu | Workspace ve agent yönetim merkezi |
| Claude veya ChatGPT | Ürün aklı, strateji, metin, mimari revizyon | Destekleyici analiz ve dokümantasyon |
| Cursor | Küçük UI düzeltmeleri ve hızlı dosya içi revizyon | Yardımcı araç |

OpenAI Codex CLI, yerel terminalde çalışan, seçili klasörde kodu okuyabilen, değiştirebilen ve komut çalıştırabilen bir kodlama ajanıdır. Kaynak: https://developers.openai.com/codex/cli

Google Antigravity, ajanları başlatmak, izlemek ve orkestre etmek için merkezi komuta merkezi olarak konumlandırılan agentic development platformudur. Kaynak: https://codelabs.developers.google.com/getting-started-google-antigravity

### 0.2 Doğrudan araçlar arası konuşma yerine handoff sistemi

Codex ve Antigravity arasında gerçek zamanlı, doğrudan ve garantili bir yerleşik konuşma köprüsü varsayılmayacaktır. Bunun yerine repo içinde dosya tabanlı güvenli handoff protokolü kurulacaktır.

Bu protokol şunlardan oluşur:

```text
.buneka/
  AGENT_STATE.md
  AGENT_HANDOFF.md
  CODEX_TASKS.md
  ANTIGRAVITY_TASKS.md
  DECISIONS.md
  RISKS.md
  CHANGELOG.md
  TASKS/
    001-database.md
    002-project-structure.md
    003-public-site.md
    004-demo-panel.md
    005-auth-license.md
    006-admin-panel.md
    007-barcode-flow.md
    008-reports.md
```

Codex, yaptığı işleri bu dosyalara işler.  
Antigravity, aynı dosyaları okuyarak projeyi devralır, görevleri böler ve ajanlara dağıtır.  
Bu yöntem basit, izlenebilir ve güvenlidir.

---

# 1. Ürün Tanımı

Buneka, küçük işletmeler için geliştirilen yıllık lisanslı, sade ve hızlı bir barkodlu fiyat sorgulama, kasa ve stok takip sistemidir.

Buneka şunları yapar:

1. Barkod okutulduğunda ürün fiyatını gösterir.
2. Ürün kayıtlı değilse hızlı ürün ekleme ekranı açar.
3. Satış gerçekleşirse kullanıcı **Satış Yapıldı** butonuna basar.
4. Satış gerçekleşmezse kullanıcı **Ana Ekrana Dön** butonuna basar.
5. Her okutma fiyat sorgusu olarak kaydedilir.
6. Satış yapılan ürünler kasaya ve raporlara işlenir.
7. Stok paketi açıksa satıştan sonra stok düşer.
8. Yönetici paneli müşterileri, lisansları, paketleri ve kullanım sayılarını izler.
9. Ek modüller yıllık ücretle açılır.
10. Demo panel üzerinden müşteri ürünü deneyebilir.

Buneka bir muhasebe programı değildir.  
Buneka resmi yazarkasa veya mali fiş sistemi değildir.  
Buneka küçük işletmenin fiyat, kasa ve stok hafızasıdır.

---

# 2. Marka Dili

## 2.1 Ana cümleler

```text
Barkodu okut, fiyatı gör, satışını bil.
```

```text
Bu ne kadar? Buneka gösterir.
```

```text
Karmaşık POS değil. Küçük işletmenin sade fiyat, kasa ve stok hafızası.
```

```text
Telefonla başla, barkod okuyucuyla hızlan.
```

## 2.2 Kullanılacak kelimeler

| Kullanılacak | Kullanılmayacak |
|---|---|
| Fiyat sorgulama | Satış yok |
| Satış Yapıldı | Başarısız satış |
| Ana Ekrana Dön | İptal edilen satış |
| Günlük kasa | Karmaşık POS |
| Stokta kalan | ERP |
| Detayları Göster | Muhasebe sistemi |
| İşiniz büyüdükçe modül açın | Zorunlu paket |

## 2.3 Ana ekran dili

Müşteri giriş yaptıktan sonra ilk ekran:

```text
Bu ne kadar?

Ürün fiyat sorgulaması yap.
Barkodu okut veya yaz.
```

Butonlar:

```text
Kamera ile Okut
Manuel Barkod Gir
Ürün Ekle
```

Ürün bulunduğunda:

```text
Satış Yapıldı
Ana Ekrana Dön
Detayları Göster
```

---

# 3. Paket Sistemi

Buneka sadece yıllık lisansla satılır. Aylık ödeme modeli kullanılmaz.

## 3.1 Ana paketler

| Paket | Yıllık fiyat | Ana vaat |
|---|---:|---|
| Buneka Fiyat | 6.000 TL | Barkodla fiyat sorgulama |
| Buneka Kasa | 9.000 TL | Fiyat sorgulama, satış kaydı ve günlük kasa |
| Buneka Stok | 15.000 TL | Fiyat, kasa, stok takibi ve stok uyarısı |
| Buneka Patron | 24.000 TL | Gelişmiş rapor, mobil patron ekranı, SERENIS notu |
| Buneka Pro Şube | 36.000 TL’den başlar | Çok cihaz, çok kullanıcı, çok şube |

## 3.2 Lansman fiyatları

İlk 100 işletme için:

| Paket | Normal yıllık | Erken kullanım lisansı |
|---|---:|---:|
| Buneka Fiyat | 6.000 TL | 5.000 TL |
| Buneka Kasa | 9.000 TL | 7.500 TL |
| Buneka Stok | 15.000 TL | 12.000 TL |
| Buneka Patron | 24.000 TL | 18.000 TL |

## 3.3 Paket yetkileri

| Özellik | Fiyat | Kasa | Stok | Patron |
|---|---:|---:|---:|---:|
| price_query | Açık | Açık | Açık | Açık |
| product_create | Açık | Açık | Açık | Açık |
| sale_create | Kapalı | Açık | Açık | Açık |
| daily_cash | Kapalı | Açık | Açık | Açık |
| stock_tracking | Kapalı | Kapalı | Açık | Açık |
| profit_details | Kapalı | Kapalı | Yöneticiye açık | Açık |
| reports | Basit | Orta | Gelişmiş | Gelişmiş |
| serenis_note | Kapalı | Kapalı | Kapalı | Açık |
| multi_device | Kapalı | Ek modül | Ek modül | Açık |
| campaign_access | Kapalı | Kapalı | Kapalı | Açık |

---

# 4. Ek Modüller

Ek modüller yıllık lisansla satılır.

| Modül | Yıllık fiyat |
|---|---:|
| Son kullanma tarihi takibi | 3.000 TL |
| Raf etiketi yazdırma | 3.000 TL |
| Cari müşteri ve veresiye defteri | 6.000 TL |
| Çoklu cihaz | 6.000 TL |
| Excel toplu ürün aktarımı | 3.000 TL |
| Bulut yedekleme | 3.000 TL |
| SERENIS akıllı işletme raporu | 6.000 TL |
| Giyim beden ve renk varyantı | 6.000 TL |
| Kırtasiye sezon modülü | 3.000 TL |
| Petshop tekrar alım uyarısı | 3.000 TL |
| Hırdavat metre, kilo ve birim takibi | 6.000 TL |
| Kozmetik son kullanma ve marka raporu | 6.000 TL |
| Çok şube | Şube başı 12.000 TL |
| Uzaktan kurulum | 3.000 TL |
| Yerinde kurulum | 6.000 TL’den başlar |

---

# 5. Sistem Katmanları

Buneka dört ana kullanıcı yüzeyinden oluşur.

## 5.1 Public Site

Herkese açık satış sitesi.

Route:

```text
/
```

İçerikler:

1. Hero alanı
2. Buneka nedir?
3. Kimler için?
4. Paketler
5. Demo panel
6. Cihazlar
7. Ek modüller
8. Bayilik
9. Sık sorulan sorular
10. İletişim

## 5.2 Demo Panel

Test etmek isteyen müşteriler için demo alanı.

Route:

```text
/demo
```

Demo özellikleri:

1. Örnek ürün yükleme
2. Telefon kamerası ile barkod okutma
3. Manuel barkod girişi
4. Fiyat gösterme
5. Satış Yapıldı
6. Ana Ekrana Dön
7. Basit günlük rapor
8. Paket yükseltme çağrıları

Demo verisi gerçek müşteri veritabanına karışmamalıdır.

## 5.3 Müşteri Uygulaması

Gerçek müşterinin kullandığı sistem.

Route:

```text
/app
```

Alt route yapısı:

```text
/app/price
/app/cash
/app/stock
/app/reports
/app/products
/app/settings
```

Ekranlar paket yetkisine göre görünür.

## 5.4 Yönetim Paneli

Buneka sahibi ve yetkili ekibin kullandığı panel.

Route:

```text
/admin
```

Alt route yapısı:

```text
/admin/customers
/admin/licenses
/admin/modules
/admin/campaigns
/admin/analytics
/admin/devices
/admin/resellers
/admin/support
/admin/audit
```

---

# 6. Kullanıcı Rolleri

| Rol | Açıklama |
|---|---|
| super_admin | Tüm Buneka sistemini yönetir |
| admin_staff | Müşteri, lisans ve destek yönetir |
| reseller | Kendi müşterilerini ve komisyonlarını takip eder |
| owner | İşletme sahibi |
| cashier | Fiyat sorgular ve satış kaydı yapar |
| viewer | Sadece rapor görür |

İlk MVP’de zorunlu roller:

```text
super_admin
owner
cashier
```

---

# 7. Teknik Mimari

## 7.1 Ana teknoloji seçimi

| Katman | Teknoloji |
|---|---|
| Frontend | Next.js App Router |
| Dil | TypeScript |
| Stil | Tailwind CSS |
| Veritabanı | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Güvenlik | Supabase RLS |
| Dosya | Supabase Storage |
| Demo | Ayrı demo data scope |
| Barkod kamera | BarcodeDetector API |
| USB okuyucu | Keyboard wedge input |
| PWA | manifest.json ve service worker |
| Deployment | Vercel + Supabase önerilir |
| Domain | buneka.com |
| Statik demo | Mevcut subdomain altında tutulabilir |

## 7.2 Route yapısı

```text
/
  Public site

/demo
  Demo panel

/login
  Giriş ekranı

/app
  Müşteri ana uygulaması

/app/price
  Fiyat sorgulama

/app/cash
  Kasa takibi

/app/stock
  Stok takibi

/app/products
  Ürün yönetimi

/app/reports
  Raporlar

/app/settings
  İşletme ayarları

/admin
  Yönetim paneli

/admin/customers
  Müşteri yönetimi

/admin/licenses
  Lisans yönetimi

/admin/modules
  Modül yönetimi

/admin/campaigns
  Kampanya yönetimi

/admin/analytics
  Kullanım analitiği

/admin/devices
  Cihaz kataloğu

/admin/resellers
  Bayi yönetimi

/admin/audit
  İşlem kayıtları
```

---

# 8. Veritabanı Tasarımı

## 8.1 organizations

Müşteri işletmeleri tutar.

```sql
id uuid primary key
name text not null
tax_number text
owner_name text
phone text
email text
city text
sector text
status text default 'active'
created_at timestamptz default now()
updated_at timestamptz default now()
```

## 8.2 stores

İşletmeye bağlı mağaza veya şubeleri tutar.

```sql
id uuid primary key
organization_id uuid references organizations(id)
name text not null
address text
city text
is_active boolean default true
created_at timestamptz default now()
updated_at timestamptz default now()
```

## 8.3 app_users

Uygulama kullanıcıları.

```sql
id uuid primary key
auth_user_id uuid
organization_id uuid references organizations(id)
store_id uuid references stores(id)
name text
email text
phone text
role text not null
is_active boolean default true
created_at timestamptz default now()
updated_at timestamptz default now()
```

## 8.4 plans

Paketler.

```sql
id uuid primary key
name text not null
code text unique not null
annual_price numeric not null
description text
is_active boolean default true
created_at timestamptz default now()
updated_at timestamptz default now()
```

Seed paketleri:

```text
Buneka Fiyat, PRICE, 6000
Buneka Kasa, CASH, 9000
Buneka Stok, STOCK, 15000
Buneka Patron, PATRON, 24000
```

## 8.5 licenses

Müşteri lisanslarını tutar.

```sql
id uuid primary key
organization_id uuid references organizations(id)
plan_id uuid references plans(id)
license_key text unique not null
starts_at date not null
expires_at date not null
status text default 'active'
renewal_price numeric
notes text
created_at timestamptz default now()
updated_at timestamptz default now()
```

## 8.6 modules

Ek modüller.

```sql
id uuid primary key
name text not null
code text unique not null
annual_price numeric
description text
is_active boolean default true
created_at timestamptz default now()
updated_at timestamptz default now()
```

## 8.7 entitlements

Müşteri özelinde açık özellikler.

```sql
id uuid primary key
organization_id uuid references organizations(id)
license_id uuid references licenses(id)
feature_code text not null
is_enabled boolean default false
expires_at date
created_at timestamptz default now()
updated_at timestamptz default now()
```

## 8.8 products

Ürünler.

```sql
id uuid primary key
organization_id uuid references organizations(id)
store_id uuid references stores(id)
barcode text not null
name text not null
category text
purchase_price numeric
sale_price numeric not null
stock_quantity numeric default 0
min_stock numeric default 0
supplier text
is_active boolean default true
created_at timestamptz default now()
updated_at timestamptz default now()
```

## 8.9 price_queries

Her barkod okutmayı fiyat sorgusu olarak kaydeder.

```sql
id uuid primary key
organization_id uuid references organizations(id)
store_id uuid references stores(id)
product_id uuid references products(id)
barcode text not null
queried_at timestamptz default now()
user_id uuid
source text
created_at timestamptz default now()
```

## 8.10 sales

Satış başlığı.

```sql
id uuid primary key
organization_id uuid references organizations(id)
store_id uuid references stores(id)
user_id uuid
total_amount numeric default 0
total_profit numeric default 0
payment_type text
sale_time timestamptz default now()
created_at timestamptz default now()
updated_at timestamptz default now()
```

## 8.11 sale_items

Satış kalemleri.

```sql
id uuid primary key
sale_id uuid references sales(id)
product_id uuid references products(id)
quantity numeric default 1
sale_price numeric not null
purchase_price numeric
profit numeric
created_at timestamptz default now()
```

## 8.12 stock_movements

Stok hareketleri.

```sql
id uuid primary key
organization_id uuid references organizations(id)
store_id uuid references stores(id)
product_id uuid references products(id)
movement_type text not null
quantity numeric not null
unit_price numeric
note text
created_at timestamptz default now()
```

## 8.13 campaigns

Kampanyalar.

```sql
id uuid primary key
name text not null
description text
target_plan text
discount_amount numeric
discount_percent numeric
starts_at date
ends_at date
is_active boolean default true
created_at timestamptz default now()
updated_at timestamptz default now()
```

## 8.14 organization_campaigns

Müşteriye özel kampanya eşleştirmeleri.

```sql
id uuid primary key
organization_id uuid references organizations(id)
campaign_id uuid references campaigns(id)
status text default 'offered'
created_at timestamptz default now()
updated_at timestamptz default now()
```

## 8.15 devices

Site ve admin panelde sergilenecek cihazlar.

```sql
id uuid primary key
name text not null
device_type text
connection_type text
price_range text
recommended_for text
affiliate_url text
image_url text
is_active boolean default true
created_at timestamptz default now()
updated_at timestamptz default now()
```

## 8.16 audit_logs

Kritik işlemleri tutar.

```sql
id uuid primary key
actor_user_id uuid
organization_id uuid references organizations(id)
action text not null
entity_type text
entity_id uuid
metadata jsonb
created_at timestamptz default now()
```

---

# 9. Temel İş Akışları

## 9.1 Public site akışı

1. Kullanıcı buneka.com’a gelir.
2. Ana vaadi görür.
3. Paketleri inceler.
4. Demo Paneli Aç butonuna basar.
5. Demo panelde ürünü dener.
6. İletişim veya satın alma talebi oluşturur.

## 9.2 Demo panel akışı

1. Demo açılır.
2. Örnek ürünler yüklenir.
3. “Bu ne kadar?” ekranı gelir.
4. Barkod okutulur veya yazılır.
5. Fiyat görünür.
6. Satış Yapıldı seçilebilir.
7. Ana Ekrana Dön seçilebilir.
8. Rapor ekranı görülür.
9. Paket yükseltme çağrısı yapılır.

## 9.3 Müşteri giriş akışı

1. Müşteri giriş yapar.
2. Sistem organization bilgisini bulur.
3. Aktif lisans kontrol edilir.
4. Plan ve entitlements okunur.
5. Paket yetkisine göre menüler açılır.
6. Ana ekran “Bu ne kadar?” olarak açılır.

## 9.4 Fiyat sorgulama akışı

1. Barkod okutulur.
2. Ürün aranır.
3. Ürün varsa price_queries kaydı atılır.
4. Fiyat gösterilir.
5. Satış gerçekleşirse sales ve sale_items kaydı oluşur.
6. Stok paketi açıksa stock_movements kaydı oluşur ve ürün stoğu düşer.
7. Satış yapılmayacaksa kullanıcı Ana Ekrana Dön seçer.
8. Satış kaydı oluşmaz.

## 9.5 Lisans yönetimi akışı

1. Admin müşteri oluşturur.
2. Plan seçer.
3. Lisans başlangıç ve bitiş tarihi girer.
4. Lisans aktif olur.
5. Entitlements otomatik oluşturulur.
6. Lisans bitimine 30 gün kala yenileme uyarısı çıkar.
7. Süre dolarsa müşteri sınırlı erişime düşer.

## 9.6 Kampanya akışı

1. Admin kampanya oluşturur.
2. Hedef paket veya müşteri seçer.
3. Kampanya müşteriye tanımlanır.
4. Müşteri panelinde kampanya mesajı görünür.
5. Satış veya yenileme yapılırsa kampanya kapatılır.

---

# 10. Raporlar

## 10.1 Müşteri uygulaması raporları

| Rapor | Paket |
|---|---|
| Günlük fiyat sorgusu | Fiyat |
| Günlük satış toplamı | Kasa |
| En çok satılan ürün | Kasa |
| En çok sorgulanan ürün | Kasa |
| Stokta kalan ürünler | Stok |
| Minimum stok uyarısı | Stok |
| Tahmini brüt kâr | Stok veya Patron |
| Haftalık özet | Patron |
| SERENIS işletme notu | Patron |

## 10.2 Admin panel raporları

| Rapor | Amaç |
|---|---|
| Aktif müşteri sayısı | Büyüme takibi |
| Lisansı bitenler | Yenileme fırsatı |
| Lisansı yaklaşanlar | Kampanya ve takip |
| En aktif müşteriler | Ürün değeri |
| Pasif müşteriler | Geri kazanım |
| Paket dağılımı | Gelir modeli |
| Modül gelirleri | Ek satış |
| Bayi performansı | Kanal yönetimi |

---

# 11. SERENIS İşletme Notu

SERENIS, Buneka içinde gelişmiş rapor ve yorum motoru olarak kullanılacaktır. İlk sürümde yapay zekâ zorunlu değildir. Önce kural tabanlı özet üretilebilir.

Örnek not:

```text
Bugün 46 fiyat sorgusu yapıldı.
12 satış kaydı oluştu.
En çok sorgulanan ürün: Çikolata Mini.
En çok satılan ürün: Su 500 ml.
Stokta azalan ürünler: Defter A5, Kalem Mavi.
Öneri: Çok sorgulanan ürünlerde fiyat ve raf görünürlüğü kontrol edilmeli.
```

Patron paketinde SERENIS notu açılır.

---

# 12. Tasarım Sistemi

## 12.1 Renkler

| Kullanım | Renk |
|---|---|
| Ana zemin | #F7F4ED |
| Kart | #FFFFFF |
| Ana metin | #20231F |
| İkincil metin | #667064 |
| Ana yeşil | #4F6F52 |
| Vurgu amber | #C8913A |
| Başarı | #3F7D53 |
| Uyarı | #B65A3C |
| Sınır çizgisi | #E4DED2 |

## 12.2 UI ilkeleri

1. Mobil öncelikli.
2. Büyük butonlar.
3. Az menü.
4. İlk ekranda tek amaç.
5. Detaylar gizli.
6. Kâr ve alış fiyatı varsayılan kapalı.
7. Yazılar kısa.
8. Teknik jargon yok.
9. Kullanıcıyı yormayan renkler.
10. Uygulama site gibi değil, kasa ekranı gibi hızlı çalışmalı.

---

# 13. Güvenlik ve Yetkilendirme

## 13.1 Temel kurallar

1. Her organization sadece kendi verisini görür.
2. Supabase RLS aktif olur.
3. Admin yetkisi ayrı tutulur.
4. Demo verisi gerçek müşteri verisine karışmaz.
5. Kritik işlemler audit_logs tablosuna yazılır.
6. Lisans bitince veri silinmez, erişim sınırlandırılır.
7. Şifreler Supabase Auth ile yönetilir.
8. Silme işlemleri mümkünse soft delete yapılır.
9. Yedekleme planı hazırlanır.
10. Admin panel işlemleri loglanır.

## 13.2 Lisans güvenliği

Lisans kontrolü backend tarafında yapılmalıdır.  
Frontend sadece gelen yetkileri gösterir.  
Kullanıcı frontend’i değiştirerek kapalı özelliklere erişememelidir.

---

# 14. Antigravity Handoff Protokolü

## 14.1 Dosya yapısı

Repo içinde aşağıdaki dosyalar oluşturulmalıdır:

```text
.buneka/
  AGENT_STATE.md
  AGENT_HANDOFF.md
  CODEX_TASKS.md
  ANTIGRAVITY_TASKS.md
  DECISIONS.md
  RISKS.md
  CHANGELOG.md
```

## 14.2 AGENT_STATE.md içeriği

```md
# AGENT STATE

Current phase:
Current active task:
Last completed task:
Next suggested task:
Open blockers:
Files changed:
Tests run:
Build status:
Human decisions needed:
```

## 14.3 AGENT_HANDOFF.md içeriği

```md
# AGENT HANDOFF

## Summary
Kısa proje durumu.

## What Codex did
Codex tarafından yapılan işler.

## What Antigravity should do next
Antigravity’nin devralacağı işler.

## Constraints
Değişmeyecek kurallar.

## Do not do
Yapılmayacak işler.

## Required verification
Test ve kontrol adımları.
```

## 14.4 Codex davranış kuralı

Her görev sonunda Codex şunları yapar:

1. Değişen dosyaları yazar.
2. Test çalıştırdıysa sonucu yazar.
3. Hata varsa RISKS.md dosyasına ekler.
4. Bir sonraki görevi önerir.
5. AGENT_STATE.md dosyasını günceller.

## 14.5 Antigravity davranış kuralı

Antigravity her yeni görevde önce şunları okur:

1. BUNEKA_PROJECT_MANIFEST.md
2. .buneka/AGENT_STATE.md
3. .buneka/AGENT_HANDOFF.md
4. .buneka/DECISIONS.md
5. .buneka/RISKS.md

Sonra görevleri ajanlara dağıtır.

---

# 15. Codex ile İlk Başlangıç Görevi

Aşağıdaki prompt Codex’e ilk verilecek görevdir.

```text
Buneka projesine başlıyoruz.

Önce sadece proje iskeleti, veritabanı migration dosyası ve agent handoff klasörünü oluştur.

Teknik stack:
Next.js App Router
TypeScript
Supabase PostgreSQL
Supabase Auth
Tailwind CSS

Ürün:
Buneka, küçük işletmeler için barkodla fiyat sorgulama, satış kaydı, kasa, stok, yıllık lisans, modül yönetimi, demo panel ve admin panel sunan SaaS ürünüdür.

Önce şu klasör yapısını oluştur:

apps/web
packages/ui
packages/core
packages/database
packages/barcode
packages/licensing
packages/reports
docs
.buneka
supabase/migrations

.buneka içinde şu dosyaları oluştur:
AGENT_STATE.md
AGENT_HANDOFF.md
CODEX_TASKS.md
ANTIGRAVITY_TASKS.md
DECISIONS.md
RISKS.md
CHANGELOG.md

Supabase migration dosyasında şu tabloları oluştur:
organizations
stores
app_users
plans
licenses
modules
entitlements
products
price_queries
sales
sale_items
stock_movements
campaigns
organization_campaigns
devices
audit_logs

Paket seed verilerini ekle:
Buneka Fiyat, PRICE, 6000
Buneka Kasa, CASH, 9000
Buneka Stok, STOCK, 15000
Buneka Patron, PATRON, 24000

Feature kodları:
price_query
product_create
sale_create
daily_cash
stock_tracking
profit_details
reports
serenis_note
multi_device
campaign_access

Kurallar:
Frontend ekranı yazma.
Google veya ödeme entegrasyonu yazma.
Sadece proje iskeleti, migration ve handoff dosyaları oluştur.
Her dosya düzenli, okunabilir ve sonraki ajanların anlayacağı şekilde olsun.
Görev sonunda AGENT_STATE.md ve AGENT_HANDOFF.md dosyalarını güncelle.
```

---

# 16. Antigravity’ye Devredilecek İlk Görev

Codex ilk görevi bitirdikten sonra Antigravity’ye şu görev verilir.

```text
Buneka reposunu incele.

Önce şu dosyaları oku:
BUNEKA_PROJECT_MANIFEST.md
.buneka/AGENT_STATE.md
.buneka/AGENT_HANDOFF.md
.buneka/DECISIONS.md
.buneka/RISKS.md

Sonra public site, demo panel, müşteri uygulaması ve admin panel için route mimarisini planla.

Henüz kod yazmadan önce şu çıktıları üret:
1. Ekran listesi
2. Bileşen listesi
3. Veri akışı
4. Paket bazlı yetki kontrol noktaları
5. İlk sprint görevleri
6. Test senaryoları

Buneka’nın ana dili:
Bu ne kadar?
Ürün fiyat sorgulaması yap.
Satış Yapıldı.
Ana Ekrana Dön.

Satış Yok ifadesi hiçbir yerde kullanılmayacak.
```

---

# 17. İlk 30 Günlük Yol Haritası

## Gün 1 ve 2

1. Repo açılır.
2. Codex ile proje iskeleti kurulur.
3. Supabase migration yazılır.
4. Handoff dosyaları oluşturulur.
5. İlk seed paketleri eklenir.

## Gün 3 ve 4

1. Antigravity workspace açılır.
2. Manifesto okunur.
3. Public site route planı çıkar.
4. Tasarım sistemi kurulur.
5. UI bileşenleri planlanır.

## Gün 5 ve 7

1. Public site yapılır.
2. Paketler gösterilir.
3. Demo Paneli Aç butonu eklenir.
4. Cihazlar ve modüller alanı eklenir.

## Gün 8 ve 10

1. Demo panel yapılır.
2. Barkod input yazılır.
3. Kamera tarama eklenir.
4. Örnek ürünler yüklenir.
5. Satış Yapıldı ve Ana Ekrana Dön akışı tamamlanır.

## Gün 11 ve 15

1. Supabase Auth bağlanır.
2. Müşteri girişi yapılır.
3. Organization ve store yapısı bağlanır.
4. Lisans kontrolü yapılır.
5. Paket yetkisine göre menüler gösterilir.

## Gün 16 ve 20

1. Ürün yönetimi yapılır.
2. Fiyat sorgusu gerçek veritabanına kaydedilir.
3. Satış kaydı oluşturulur.
4. Kasa raporu yapılır.
5. Stok hareketi bağlanır.

## Gün 21 ve 25

1. Admin panel yapılır.
2. Müşteri ekleme.
3. Lisans açma.
4. Paket değiştirme.
5. Modül açma.
6. Kampanya tanımlama.

## Gün 26 ve 30

1. Testler yazılır.
2. Mobil test yapılır.
3. Demo test edilir.
4. Lisans senaryoları test edilir.
5. Canlı yayına hazırlık yapılır.

---

# 18. İlk MVP Kabul Kriterleri

MVP tamamlandı sayılması için:

1. Public site açılır.
2. Demo panel çalışır.
3. Barkod manuel giriş çalışır.
4. Kamera ile barkod okutma destekleyen cihazda çalışır.
5. Müşteri giriş yapabilir.
6. Lisans aktif değilse erişim sınırlanır.
7. Paket yetkisine göre menüler değişir.
8. Ürün eklenir.
9. Fiyat sorgusu kaydedilir.
10. Satış Yapıldı satış kaydı oluşturur.
11. Ana Ekrana Dön satış kaydı oluşturmaz.
12. Stok paketi açık ise stok düşer.
13. Admin müşteri ekler.
14. Admin lisans tanımlar.
15. Admin kullanım istatistiklerini görür.
16. Satış Yok ifadesi hiçbir yerde bulunmaz.

---

# 19. Yapılmayacaklar

İlk MVP’de yapılmayacaklar:

1. Resmi fiş kesme.
2. Yazarkasa entegrasyonu.
3. E fatura entegrasyonu.
4. Muhasebe entegrasyonu.
5. Çok şube tam sistemi.
6. Bayi paneli.
7. Otomatik online ödeme.
8. Native mobil uygulama.
9. Ağır ERP özellikleri.
10. Her sektöre özel detaylı modüller.

---

# 20. Nihai Hüküm

Buneka, yıllık lisansla çalışan küçük işletme SaaS ürünüdür.

En sade tanım:

```text
Buneka, küçük işletmelerin barkodla fiyat görmesini, satışını kaydetmesini, kasasını ve stokunu sade şekilde takip etmesini sağlayan yıllık lisanslı işletme hafızasıdır.
```

En güçlü ürün farkı:

```text
Buneka her barkod okutmayı fiyat sorgusu olarak kaydeder.
Satış gerçekleşirse satışa dönüştürür.
Böylece işletme sadece satışları değil, ürün ilgisini de görür.
```

Ana geliştirme ilkesi:

```text
Önce çalışan çekirdek.
Sonra lisans sistemi.
Sonra admin panel.
Sonra modüller.
Sonra bayi ağı.
```

Bu proje Codex ile başlatılacak, Antigravity ile orkestre edilecek, her aşama handoff dosyalarıyla izlenecektir.
