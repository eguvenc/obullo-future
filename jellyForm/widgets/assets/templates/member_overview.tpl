<script>
<% 
    var title             = data.title;
    var account           = data.left;
    var games             = data.games;
    var coupon            = data.coupons;
    var totalCouponDeposit = parseFloat(coupon.win.deposit) + parseFloat(coupon.lose.deposit) ;
    var couponPercentage  = (parseFloat(coupon.win.gain) - totalCouponDeposit) / totalCouponDeposit * 100 ;

    var totalGamesDeposit = parseFloat(games.win.deposit) + parseFloat(games.lose.deposit) ;
    var gamesPercentage  = (parseFloat(games.win.gain) - totalGamesDeposit) / totalGamesDeposit * 100;
    var avg               = parseFloat(data.avg);
    var couponTotal       = parseFloat(account.money.deposit) - parseFloat(account.money.withdraw);
    var couponTotalWBonus = parseFloat(couponTotal)-parseFloat(account.bonus.referral)-parseFloat(account.bonus.cycle.real);
    var couponClass       = (couponTotal < 0)  ?  'red' : 'green' ;
    var couponWClass      = (couponTotalWBonus < 0)  ?  'red' : 'green' ;
    var referral          = (account.referral.id != '-') ? '<a target="_blank" href="/members/member_management/'+account.referral.id+'">'+account.referral.user +'</a>' : '-'; 
%>
<div class="col-sm-6">
    <div class="userInfo" style="padding-bottom:10px">
        <% if (data.user_image) { %>
            <div style="display:inline-block">
                <a href="<%=data.user_image %>" target="_blank"><img src="<%=data.user_image %>" class="img-thumbnail" width="100"></a>
            </div>
            
        <% } %>
        <div style="display:inline-block;vertical-align:bottom;margin-left:10px;">
            <span class="username"><%= data.username %> </span>
            <input id="input1" type="text" class="rating baseFont" value="<%= avg%>">
        </div>
    </div>

    <table class="table table-bordered table-striped table-hover">
    <thead>
        <tr><th colspan="2"><%= title.member_details %></th></tr>
    </thead>
        <tbody>
            <tr>
                <td><%= title.status %></td>
                <td><%= account.account.status %></td>
            </tr>
            <tr>
                <td><%= title.whatsapp_status %></td>
                <td><%= data.user_whatsapp_status %></td>
            </tr>
            <tr>
                <td><%= title.referral %></td>
                <td><%= referral %></td>
            </tr>
            <tr>
                <td><%= title.register %></td>
                <td><%= (account.register.date.sec == 0 ) ? '-' : COMMON.settings.getFullDate(account.register.date.sec) %></td>
            </tr>
            <tr>
                <td><%= title.total_login %></td>
                <td><%= account.login.total %></td>
            </tr>
            <tr>
                <td><%= title.last_login %></td>
                <td><%= (account.login.last.sec  == 0 ) ? '-' : COMMON.settings.getFullDate(account.login.last.sec) %></td>
            </tr>
            <tr>
                <td><%= title.real_balance %></td>
                <td><%= ACCOUNTING.formatMoney(account.balance.real, "", 2, ",",".") %></td>
            </tr>
            <tr>
                <td><%= title.bonus_balance %></td>
                <td><%= ACCOUNTING.formatMoney(account.balance.bonus, "", 2, ",",".") %></td>
            </tr>
            <tr>
                <td><%= title.deposit %></td>
                <td><%= ACCOUNTING.formatMoney(account.money.deposit, "", 2, ",",".") %></td>
            </tr>
            <tr>
                <td><%= title.withdrawal %></td>
                <td><%= ACCOUNTING.formatMoney(account.money.withdraw, "", 2, ",",".") %></td>
            </tr>
            <tr>
                <td><%= title.deposit_bonus %></td>
                <td><%= ACCOUNTING.formatMoney(account.bonus.deposit, "", 2, ",",".") %></td>
            </tr>                       
            <tr>
                <td><%= title.bonus_cycle %></td>
                <td><%= ACCOUNTING.formatMoney(account.bonus.cycle.real, "", 2, ",",".") %></td>
            </tr>
            <tr>
                <td><%= title.bonus_earnings %></td>
                <td><%= ACCOUNTING.formatMoney(account.account.bonus.earnings.referral, "", 2, ",",".") %></td>
            </tr>
            <tr>
                <td><%= title.bonus_combination %></td>
                <td><%= ACCOUNTING.formatMoney(account.account.bonus.earnings.combination, "", 2, ",",".") %></td>
            </tr>
            <tr>
                <td><%= title.bonus_happyHour %></td>
                <td><%= ACCOUNTING.formatMoney(account.account.bonus.earnings.hh, "", 2, ",",".") %></td>
            </tr>

            <tr>
                <td><%= title.bonus_referral %></td>
                <td><%= ACCOUNTING.formatMoney(account.bonus.referral, "", 2, ",",".") %></td>
            </tr>
            <tr>
                <td><b><%= title.profit_loss %></b></td>
                <td><b style="color:<%=couponClass%>"><%= ACCOUNTING.formatMoney(couponTotal, "", 2, ",",".") %></b></td>
            </tr>   
            <tr>
                <td><b><%= title.profit_loss_w_bonus %></b></td>
                <td><b style="color:<%=couponWClass%>"><%= ACCOUNTING.formatMoney(couponTotalWBonus, "", 2, ",",".") %></b></td>
            </tr>
        </tbody>
    </table>
</div>
<div class="col-sm-6">
    <span class="username"></span>
    <table class="table table-bordered table-striped table-hover tableAligned">
    <thead>
        <tr><th colspan="2"><%= title.sport_details %></th></tr>
    </thead>
        <tbody>
            <tr>
                <td><%= title.total_coupon_count %></td>
                <td><%= coupon.total %></td>
            </tr>
            <tr>
                <td><%= title.won_coupons_count %></td>
                <td><%= coupon.win.total %></td>
            </tr>           
            <tr>
                <td><%= title.canceled_coupons_count %></td>
                <td><%= coupon.cancel %></td>
            </tr>
            <tr>
                <td><%= title.total_coupon_gains %></td>
                <td><%= ACCOUNTING.formatMoney(coupon.win.gain, "", 2, ",",".") %></td>
            </tr>
            <tr>
                <td><%= title.won_coupons_deposit %></td>
                <td><%= ACCOUNTING.formatMoney(coupon.win.deposit, "", 2, ",",".") %></td>
            </tr>
            <tr>
                <td><%= title.loss_coupons_count %></td>
                <td><%= coupon.lose.total %></td>
            </tr>
            <tr>
                <td><%= title.loss_coupons_deposit %></td>
                <td><%= ACCOUNTING.formatMoney(coupon.lose.deposit, "", 2, ",",".") %></td>
            </tr>
            <tr>
                <td><b><%= title.user_c_success %></b></td>
                <td><%= (isNaN(couponPercentage)) ? '<b>0%</b>' : (parseFloat(couponPercentage) < 0) ? '<b class="text text-success">'+parseFloat(couponPercentage).toFixed(2)+' %</b>' :  '<b class="text text-danger">'+parseFloat(couponPercentage).toFixed(2)+' %</b>' %></td>
            </tr>
        </tbody>
    </table>
    <table class="table table-bordered table-striped table-hover tableAligned">
    <thead>
        <tr><th colspan="2"><%= title.games_details %></th></tr>
    </thead>
        <tbody>
            <tr>
                <td><%= title.games_count %></td>
                <td><%= games.total %></td>
            </tr>
            <tr>
                <td><%= title.won_games %></td>
                <td><%= games.win.total %></td>
            </tr>
            <tr>
                <td><%= title.games_earnings %></td>
                <td><%= ACCOUNTING.formatMoney(games.win.gain, "", 2, ",",".") %></td>
            </tr>
            <tr>
                <td><%= title.won_games_deposit %></td>
                <td><%= ACCOUNTING.formatMoney(games.win.deposit, "", 2, ",",".") %></td>
            </tr>
            <tr>
                <td><%= title.loss_games %></td>
                <td><%= games.lose.total %></td>
            </tr>
            <tr>
                <td><%= title.loss_games_deposit %></td>
                <td><%= ACCOUNTING.formatMoney(games.lose.deposit, "", 2, ",",".") %></td>
            </tr>
             <tr>
                <td><b><%= title.user_g_success %></b></td>
                <td><%= (isNaN(gamesPercentage)) ? '<b>0%</b>' : (parseFloat(gamesPercentage) < 0) ? '<b class="text text-success">'+parseFloat(gamesPercentage).toFixed(2)+' %</b>' :  '<b class="text text-danger">'+parseFloat(gamesPercentage).toFixed(2)+' %</b>' %></td>
            </tr>
        </tbody>
    </table>
</div>
</script>   