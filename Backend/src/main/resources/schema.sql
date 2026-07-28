
create table if not exists checkoutData(
 orderid int primary key ,
 checkin date,
 checkout date,
  customerId int,
roomId int,
 status int
);

DROP TRIGGER IF EXISTS backup_checkout;


CREATE TRIGGER backup_checkout
    BEFORE DELETE ON orders
    FOR EACH ROW

    INSERT INTO checkoutData (orderid, checkin, checkout, customerId, roomId, status)
    VALUES (
               OLD.order_id,
               OLD.check_in,
               OLD.check_out,
               OLD.customer_id,
               OLD.room_id,
               1
           );


-- one clear understanding is we should not add the delimiter here specifically as
--  this is not a SQL workbench