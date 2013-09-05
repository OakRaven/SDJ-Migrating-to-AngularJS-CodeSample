(function($, _){
  'use strict';

  // jQuery handles to DOM objects
  var $containerNumber =         $('#container-number'),
      $searchContainerList =     $('#search-container-list'),
      $searchPanel =             $('#search-panel'),
      $resultsPanel =            $('#results-panel'),
      $additionalInfoContainer = $('#additional-info-container');

  // application variables
  var containersToSearch =       [],
      matchingContainers =       [],
      selectedContaier =         null;

  // Add a container to the list of containers to search for
  $('#add-button').click(function(e){
    e.preventDefault();

    var containerNumber = $containerNumber.val().toUpperCase();
    if(containerNumber) {
      containersToSearch.push(containerNumber);
      refreshContainerList();
      prepareForNextContainer();
    }
  });

  // Clear input box and set focus for next container number
  function prepareForNextContainer(){
    $containerNumber.val('');
    $containerNumber.focus();
  }

  // Refresh list of containers to search for
  function refreshContainerList(){
    var html = '';
    _.each(containersToSearch, function(containerNumber){
      html += '<option value="' + containerNumber + '">' + containerNumber + '</option>';
    });

    $searchContainerList.empty();
    $searchContainerList.append(html);
  }

  // Remove container from the list of containers to search for
  $('#remove-button').click(function(e){
    e.preventDefault();

    if($searchContainerList.val().length > 0 && confirm('Remove selected containers?')){
      var containersToKeep = [];
      var containersToRemove = $searchContainerList.val();

      _.each(containersToSearch, function(value){
        if(_.indexOf(containersToRemove, value) < 0){
          containersToKeep.push(value);
        }
      });

      containersToSearch = containersToKeep;
      refreshContainerList();
      prepareForNextContainer();
    }
  });

  // Remove all containers from the list of containers to search for
  $('#reset-button').click(function(e){
    e.preventDefault();

    if(confirm('Remove all containers?')){
      containersToSearch = [];
      refreshContainerList();
      prepareForNextContainer();
    }
  });

  // Initiate search
  $('#search-button').click(function(e){
    e.preventDefault();

    if($searchContainerList.children().length) {
      var containerNumbers = [];
      _.each($searchContainerList.children(), function(option){
        var containerNumber = $(option).attr('value');
        containerNumbers.push(containerNumber);
      });

      searchFor(containerNumbers);
    }
  });

  // Hide search form and then continue search
  function searchFor(containerNumbers){
    $searchPanel.slideUp('fast',
      function(){
        performSearch(containerNumbers);
      });
  }

  // Continue search and display search results
  function performSearch(containerNumbers){
    $('#results-summary tbody').empty();
    $additionalInfoContainer.hide();

    fetchContainers(containerNumbers);
  }

  // Display search results
  function displaySearchResults(){
    var html = '';

    _.each(matchingContainers, function(result){
      html +=
        '<tr>' +
        '<td><a href="" class="results-container-number" data-container="' + result.Container + '">' + result.Container + '<a></td>' +
        '<td>' + result.Size + '</td>' +
        '<td>' + result.Vessel + '</td>' +
        '<td>' + result.Voyage + '</td>' +
        '<td>' + result.Owner + '</td>' +
        '<td>' + result.DischargeDate + '</td>' +
        '<td>' + result.Location + '</td>' +
        '<td>' + result.Activity + '</td>' +
        '<td>' + result.ActivityDate + '</td>' +
        '<td>' + result.ActivityLocation + '</td>' +
        '</tr>';
    });

    $('#results-summary tbody').append(html);

    $resultsPanel.slideDown('fast');
  }

  // Load data from web-service
  function fetchContainers(containerNumbers){
    $.getJSON('/js/sample-data.json', function(data){
      matchingContainers = [];

      _.each(containerNumbers, function(containerNumber){
        var container = _.findWhere(data, {'Container': containerNumber});
        if(container){
          matchingContainers.push(container);
        }
      });

      displaySearchResults();
    });
  }

  // A container in the search results has been clicked, display additional information
  function containerClicked(e){
    e.preventDefault();

    var $target = $(e.target);
    $('#results-summary td').removeClass('selected');
    $target.parents('tr').children('td').addClass('selected');
    selectedContaier = $target.data('container');

    displayAdditionalInfo();
  }

  // Display additional information for the selected container
  function displayAdditionalInfo(){
    var container = _.findWhere(matchingContainers, {'Container': selectedContaier});
    var html = '';

    if(container) {
      $('#results-dwell-time tbody').empty();
      $('#results-movements tbody').empty();

      $additionalInfoContainer.fadeOut('fast', function(){
        var dwell = container.DwellTime;
        if(dwell) {
          html =
            '<tr>' +
              '<td>' + dwell.Container + '</td>' +
              '<td>' + dwell.DischargeDate + '</td>' +
              '<td>' + dwell.RampDate + '</td>' +
              '<td>' + dwell.DepartureDate + '</td>' +
              '<td>' + dwell.TermDwell + '</td>' +
              '<td>' + dwell.RailDwell + '</td>' +
              '<td>' + (dwell.TermDwell + dwell.RailDwell) + '</td>' +
            '</tr>';

          $('#results-dwell-time tbody').append(html);
        }

        var movements = container.Movements;
        if(movements) {
          html = '';

          _.each(movements, function(movement){
            html +=
              '<tr>' +
                '<td>' + movement.Container + '</td>' +
                '<td>' + movement.From + '</td>' +
                '<td>' + movement.DepartureDate + '</td>' +
                '<td>' + movement.To + '</td>' +
                '<td>' + movement.ArrivalDate + '</td>' +
                '<td>' + movement.Car + '</td>' +
                '<td>' + movement.Train + '</td>' +
              '</tr>';
          });

          $('#results-movements tbody').append(html);
        }

        $additionalInfoContainer.fadeIn('fast');
      });
    }
  }

  // Display the search form again, allowing the user to modify their search
  $('#modify-button').click(function(e){
    e.preventDefault();
    $resultsPanel.slideUp('fast', function(){
      $searchPanel.slideDown('fast', function(){
        $containerNumber.focus();
      });
    });
  });

  // Display the search screen, initialized for a new search
  $('#new-button').click(function(e){
    e.preventDefault();
    if(confirm('Are you sure you want to reset your search?')){
      containersToSearch = [];
      refreshContainerList();

      $resultsPanel.slideUp('fast', function(){
        $searchPanel.slideDown('fast', function(){
          $containerNumber.focus();
        });
      });
    }
  });

  // Initialize on load
  $(function(){
    $containerNumber.focus();
    $('#results-summary').on('click', 'a.results-container-number', containerClicked);
  });
})(jQuery, _);