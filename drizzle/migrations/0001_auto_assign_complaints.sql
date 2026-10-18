create or replace function public.on_complaint_created()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  _technician uuid;
  _technician_category uuid;
  _note text;
begin
  insert into public.complaint_updates (complaint_id, author_id, new_status, note)
  values (new.id, new.reporter_id, 'registered', 'Complaint registered');

  perform public.notify(ur.user_id, new.id, 'New complaint ' || new.ticket_no, new.title)
    from public.user_roles ur
    where ur.role in ('estate_manager','admin') and ur.user_id <> new.reporter_id;
  perform public.notify(
    new.reporter_id,
    new.id,
    'Complaint registered',
    'Your ticket ' || new.ticket_no || ' has been registered.'
  );

  -- Serialize workload selection so simultaneous submissions do not all pick the same least-loaded technician.
  perform pg_advisory_xact_lock(887731, 1);

  select t.user_id, t.category_id
    into _technician, _technician_category
    from public.technicians t
    where t.is_available
    order by
      case when t.category_id = new.category_id then 0 else 1 end,
      (
        select count(*)
          from public.complaints c
          where c.assigned_technician_id = t.user_id
            and c.status in ('assigned', 'in_progress')
      ),
      t.user_id
    limit 1;

  if _technician is not null then
    _note := case
      when _technician_category = new.category_id
        then 'Automatically assigned to an available technician in this category.'
      else 'Automatically assigned to an available technician because no available technician matched this category.'
    end;

    update public.complaints
      set assigned_technician_id = _technician,
          status = 'assigned',
          updated_at = now()
      where id = new.id;

    insert into public.assignments (complaint_id, technician_id, assigned_by, note)
    values (new.id, _technician, null, _note);

    insert into public.complaint_updates (
      complaint_id, author_id, old_status, new_status, note, created_at
    )
    values (new.id, null, 'registered', 'assigned', _note, clock_timestamp());

    perform public.notify(
      _technician,
      new.id,
      'New job assigned ' || new.ticket_no,
      new.title
    );
    perform public.notify(
      new.reporter_id,
      new.id,
      'Technician assigned',
      'An available technician has been assigned to ' || new.ticket_no || '.'
    );
  end if;

  return new;
end $$;
