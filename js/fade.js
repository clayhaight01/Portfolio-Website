$(document).ready(function() {
    
    $(window).scroll( function(){
    
        $('.overlay').each( function(i){
            
            var bottom_of_object = $('.pcb_side').position().top + $('.pcb_side').outerHeight();
            var bottom_of_window = $(window).scrollTop() + $(window).height();
            
            if(bottom_of_window > bottom_of_object ){
                $(this).animate({'opacity':'1'},100,"swing");         
            }
        }); 
    }); 
});