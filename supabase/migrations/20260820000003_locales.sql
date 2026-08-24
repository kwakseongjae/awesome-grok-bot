-- Allow ja / zh-CN / zh-TW listing and profile locales.

alter table public.profiles drop constraint if exists profiles_locale_check;
alter table public.profiles
  add constraint profiles_locale_check
  check (locale in ('ko', 'en', 'ja', 'zh-CN', 'zh-TW'));

alter table public.bots drop constraint if exists bots_locale_check;
alter table public.bots
  add constraint bots_locale_check
  check (locale in ('ko', 'en', 'ja', 'zh-CN', 'zh-TW'));
